import React, {Component} from 'react';
import Route from './src/routestack/Route';
import {
  createNotificationListeners,
} from './src/utils/notificationHelper';
import { LogBox } from 'react-native';
import {requestUserPermission} from './src/utils/notificationHelper';
import {GetFCMtoken} from './src/utils/notificationHelper';

class App extends Component {

  componentDidMount() {
    LogBox.ignoreLogs(['Warning: ...']);
    requestUserPermission();
    GetFCMtoken();
    createNotificationListeners();
  }

  render() {
    return <Route />;
  }
}

export default App;
