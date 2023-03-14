import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function GetFCMtoken() {
  let fcmtoken = await AsyncStorage.getItem('fcmToken');
  console.log('Old Token:', fcmtoken, '======');
  if (!fcmtoken) {
    try {
      let fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        await AsyncStorage.setItem('fcmToken', fcmtoken);
        console.log('New Token :', fcmtoken, '=====');
      }
    } catch (error) {
      console.log(error, '===err===');
    }
  }
}

export async function createNotificationListeners(
  onRegister,
  onNotification,
  onOpenNotification,
) {
  // When the application is running, but in the background

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      '@@@ FCM SERVICE ON NOTIFICATION CAUSED APP TO OPEN FROM BACKGROUND STATE ===========',
      remoteMessage,
    );
    if (remoteMessage) {
      const notification = remoteMessage.notification;
      if (!remoteMessage.data) {
        onOpenNotification(notification);
        return;
      }
      //@ts-ignore
      notification.userInteraction = true;
      onOpenNotification(Platform.OS === 'ios' ? remoteMessage : remoteMessage);
      // this.removeDeliveredNotification(notification.notificationId)
    }
  });

  // When the application is opened from a quit state.

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      console.log(
        '@@@ FCM SERVICE ON NOTIFICATION CAUSED APP TO OPEN FROM KILLED STATE ===========' +
          JSON.stringify(remoteMessage),
      );
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        if (!remoteMessage.data) {
          onOpenNotification(notification);
          return;
        }
        //@ts-ignore
        notification.userInteraction = true;
        onOpenNotification(
          Platform.OS === 'ios' ? remoteMessage : remoteMessage,
        );
        //this.removeDeliveredNotification(notification.notificationId)
      }
    });

  // Foreground state messages
  messaging().onMessage(async remoteMessage => {
    const {notification, messageId} = remoteMessage;
    console.log(
      '@@@ FCM SERVICE A NEW FCM MESSAGE IS ARRIVED FOREGROUND ===========' +
        JSON.stringify(remoteMessage),
    );
    if (remoteMessage) {
      // let notification = null;
      if (Platform.OS === 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: messageId,
          title: notification.title,
          body: notification.body,
          sound: 'default',
        });
      } else {
        notification = remoteMessage;
      }
      notification['title'] = remoteMessage.notification.title;
      notification['message'] = remoteMessage.notification.body;
      onNotification(notification);
    }
  });

  messaging().onTokenRefresh(fcmToken => {
    console.log('@@@ FCM SERVICE A NEW TOKEN REFRESH ===========', fcmToken);
    onRegister(fcmToken);
  });
}
