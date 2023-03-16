import React, {Component} from 'react';
import Route from './src/routestack/Route';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FCM_API_KEY, WP_JSON_URL} from './src/utils/Config';
import {
  createNotificationListeners,
} from './src/utils/notificationHelper';
import {requestUserPermission} from './src/utils/notificationHelper';
import {GetFCMtoken} from './src/utils/notificationHelper';

class App extends Component {
  getId = async () => {
    let fcmtoken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmtoken);
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

  

  componentDidMount() {
    // this.setupNotification();
    requestUserPermission();
    GetFCMtoken();
    createNotificationListeners();
    // NotificationListener();
    this.getId();
  }

  render() {
    return <Route />;
  }
}

export default App;
