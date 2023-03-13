import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native/types';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

class FCMService {

  register = (onRegister, onNotification, onOpenNotification) => {
      this.checkPermission(onRegister);
      this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
  }

  registerAppWithFCM = async () => {
      if (Platform.OS === 'ios') {
          await messaging().registerDeviceForRemoteMessages();
          await messaging().setAutoInitEnabled(true);
      }
  }

  checkPermission = async (onRegister) => {
      const authStatus = await messaging().requestPermission();
      const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
          messaging().hasPermission()
              .then(enabled => {
                  if (enabled) {
                      // User has permission
                      this.getToken(onRegister);
                  } else {
                      // User doesn't have permission
                      this.requestPermission(onRegister);
                  }
              }).catch(error => {
                  //  console.log('@@@ FCM SERVICE PERMISSION REJECT ERROR ===========', error);
              })
      } else {
          alert('Permission denied')
      }
  }

  getToken = (onRegister) => {
      messaging().getToken()
          .then(async fcmToken => {
              if (!!fcmToken) {
                  await AsyncStorage.setItem('USER_FCM_TOKEN', fcmToken);
                  onRegister(fcmToken);
              } else {
                  console.log('@@@ FCM SERVICE USER DOES NOT HAVE DEVICE TOKEN ===========');
              }
          }).catch(error => {
              //  console.log('@@@ FCM SERVICE GET TOKEN ERROR ===========', error);
          })
  }

  requestPermission = (onRegister) => {
      messaging().requestPermission()
          .then(() => {
              this.getToken(onRegister);
          }).catch(error => {
              console.log('@@@ FCM SERVICE REQUEST PERMISSION REJECTED ===========', error);
          })
  }

  deleteToken = () => {
      //@ts-ignore
      messaging.deleteToken()
          .catch((error) => {
              console.log('@@@ FCM SERVICE DELETE TOKEN ERROR ===========', error);
          })
  }

  createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {

      // When the application is running, but in the background
      messaging()
          .onNotificationOpenedApp(remoteMessage => {
              console.log('@@@ FCM SERVICE ON NOTIFICATION CAUSED APP TO OPEN FROM BACKGROUND STATE ===========', remoteMessage);
              if (remoteMessage) {

                  const notification = remoteMessage.notification
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
              console.log('@@@ FCM SERVICE ON NOTIFICATION CAUSED APP TO OPEN FROM KILLED STATE ===========' + JSON.stringify(remoteMessage));
              if (remoteMessage) {
                  const notification = remoteMessage.notification;
                  if (!remoteMessage.data) {
                      onOpenNotification(notification);
                      return;
                  }
                  //@ts-ignore
                  notification.userInteraction = true;
                  onOpenNotification(Platform.OS === 'ios' ? remoteMessage : remoteMessage);
                  //this.removeDeliveredNotification(notification.notificationId)
              }
          });

      // Foreground state messages
      messaging().onMessage(async (remoteMessage) => {
          const { notification, messageId } = remoteMessage
          console.log('@@@ FCM SERVICE A NEW FCM MESSAGE IS ARRIVED FOREGROUND ===========' + JSON.stringify(remoteMessage));
          if (remoteMessage) {
              let notification = null;
              if (Platform.OS === 'ios') {
                  PushNotificationIOS.addNotificationRequest({
                      id: messageId,
                      title: notification.title,
                      body: notification.body,
                      sound: 'default'
                  });
                  // notification = remoteMessage;
                  // onNotification(notification);

              } else {
                  notification = remoteMessage;
              }
              notification['title'] = remoteMessage.notification.title;
              notification['message'] = remoteMessage.notification.body;
              onNotification(notification);
          }
      });

      // Triggered when have new token
      messaging().onTokenRefresh(fcmToken => {
          console.log('@@@ FCM SERVICE A NEW TOKEN REFRESH ===========', fcmToken);
          onRegister(fcmToken);
      });

  }

  // unRegister = () => {
  //     this.messageListener();
  // }

}

export const fcmService = new FCMService();


// export async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//   }
// }

// export async function GetFCMtoken() {
//   let fcmtoken = await AsyncStorage.getItem('fcmToken');
//   console.log('Old Token:', fcmtoken, '======');
//   if (!fcmtoken) {
//     try {
//       let fcmtoken = await messaging().getToken();
//       if (fcmtoken) {
//         await AsyncStorage.setItem('fcmToken', fcmtoken);
//         console.log('New Token :', fcmtoken, '=====');
//       }
//     } catch (error) {
//       console.log(error, '===err===');
//     }
//   }
// }

// export const NotificationListener = () => {
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log(
//       'Notification caused app to open from background state:',
//       remoteMessage.notification,
//     );
//   });

//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log(
//           'Notification caused app to open from quit state:',
//           remoteMessage.notification,
//         );
//         //   setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
//       }
//       // setLoading(false);
//     });

//   messaging().onMessage(async remoteMessage => {
//     console.log('Notification on foreground state....', remoteMessage);
//   });
// };
