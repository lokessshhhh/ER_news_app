//import liraries
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreens/HomeScreen';
import TopHeadlines from '../screens/TopTabScreens/TopHeadlines';
import DetailedHeadline from '../screens/TopTabScreens/DetailedHeadline';
import OriginalContent from '../screens/HomeScreens/OriginalContent';
import SplashScreen from '../screens/HomeScreens/SplashScreen';

const Stack = createNativeStackNavigator();

const screens = [
  {
    name: 'SplashScreen',
    component: SplashScreen,
  },
  {
    name: 'HomeScreen',
    component: HomeScreen,
  },
  {
    name: 'TopHeadlines',
    component: TopHeadlines,
  },
  {
    name: 'DetailedHeadline',
    component: DetailedHeadline,
  },
  {
    name: 'OriginalContent',
    component: OriginalContent,
  },
];

class Route extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {screens.map((item,index) => (
            <Stack.Screen 
            key={index}
            name={item.name} 
            component={item.component} 
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Route;
