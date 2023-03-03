import React, {Component} from 'react';
import {View} from 'react-native';
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
    let fcmtoken = await AsyncStorage.getItem('fcmToken');

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
    requestUserPermission();
    GetFCMtoken();
    NotificationListener();
    this.getId();
  }

  render() {
    return <Route />;
  }
}

export default App;
