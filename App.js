import React, {Component} from 'react';
import Route from './src/routestack/Route';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NotificationListener,
  requestUserPermission,
} from './src/utils/notificationHelper';
import {GetFCMtoken} from './src/utils/notificationHelper';
import {FCM_API_KEY, WP_JSON_URL} from './src/utils/Config';

class App extends Component {

  getId = async () => {
    
    let fcmtoken = await AsyncStorage.getItem('USER_FCM_TOKEN');

    DeviceInfo.getUniqueId()
      .then(async Id => {
        let formData = {
          rest_api_key: FCM_API_KEY,
          device_token: fcmtoken,
          subscription: 'Device',
          device_uuid: Id,
        };
        await axios
          .post(`${WP_JSON_URL}fcm/pn/subscribe`, formData)
          .then(res => {
            console.log(res.data, '===token res===');
          })
          .catch(err => {
            console.log(err.response.data, '===token err==');
          });
      })
      .catch(err => {
        console.log(err, '====system err=====');
      });
  };

  setupNotification = async () => {
    let accessToken = await AsyncStorage.getItem('USER_FCM_TOKEN');
    if (!accessToken) {
      try {
        fcmService.register(
          (token) => this.onRegister(token),
          (notify) => this.onNotification(notify),
          (notify) => this.onOpenNotification(notify),
        );
        localNotificationService.configure((notify) =>
          this.onOpenNotification(notify),
        );
      } catch (error) {
        console.log('==err======,token');
       }
    }
  };

  onRegister = async (token) => {
    console.log(token,'==token===');
    // let fcmToken = await AsyncStorage.getItem("USER_FCM_TOKEN");
    // let userID = await StorageProvider.get("USER_ID");
    // this.setState({ userID: userID })
    // this.sendDeviceTokenApiCallId = await this.apiCall({
    //   contentType: configJSON.productApiContentType,
    //   method: configJSON.apiMethodTypePut,
    //   endPoint: configJSON.sendDeviceTokenAPiEndPoint,
    //   body: data,
    // });
    // Customizable Area Start
    // Customizable Area End
  };
  onNotification = (notify) => {
    // if (1001 !== 1001)
    //   return;
    let uniquedNotifId = Math.floor(Math.random() * 1000 + 1);
    const options = {
      soundName: "default",
      playSound: true,
    };
    if (notify.title) {
      console.log("@@@ FCM Show Notification ==========,", this.notificationMessageId)
      let notifyMessageId = notify.messageId.replace('0:', '').split('%');
      notifyMessageId = notifyMessageId[0].substr(notifyMessageId[0].length - 3);
      console.log('@@@ FCM Show Notification ID =====', notifyMessageId, uniquedNotifId)
      if (Number(this.notificationMessageId) != Number(notifyMessageId)) {
        console.log('@@@ FCM Show Notification ID ===== 111', notifyMessageId, uniquedNotifId)
        this.notificationMessageId = Number(notifyMessageId);
        // localNotificationService.showNotification(Number(notifyMessageId), notify.title, notify.message, notify, options);
      }
    }
    // Customizable Area Start
    // Customizable Area End
  };


  onOpenNotification = (notify) => {
    console.log(notify,'====opennoti-===');
   };

  componentDidMount() {
    this.setupNotification();
    // requestUserPermission();
    // GetFCMtoken();
    // NotificationListener();
    this.getId();
  }

  render() {
    return <Route />;
  }
}

export default App;
