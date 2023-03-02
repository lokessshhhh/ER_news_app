import React, {Component} from 'react';
import {Settings} from 'react-native'
import Route from './src/routestack/Route';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NotificationListner,
  requestUserPermission,
} from './src/utils/notificationHelper';
import {GetFCMtoken} from './src/utils/notificationHelper';

class App extends Component {

  getId = async () => {

    let fcmtoken = await AsyncStorage.getItem('fcmToken');

    DeviceInfo.getUniqueId()
      .then(async Id => {
        let formData = {
          rest_api_key:
          '8p24q2315p_0s19q1000-6q3n77psn690ss674159rpqr-675n02s1ps953n277qor4s6s11q99',
          device_token: fcmtoken,
          subscription: 'Device',
          device_uuid: Id,
        };
        await axios
          .post(
            'http://104.152.168.42/~healthca/staging-empire-reportny/wp-json/fcm/pn/subscribe',
            formData,
          )
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
    NotificationListner();
    this.getId();
  };

  render() {
    return <Route />;
  }
}

export default App;
