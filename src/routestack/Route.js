//import liraries
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreens/HomeScreen';
import TopHeadlines from '../screens/TopTabScreens/TopHeadlines';
import DetailedHeadline from '../screens/TopTabScreens/DetailedHeadline';

const Stack = createNativeStackNavigator();

const linking = {
  
  prefixes: ['empirereport://', 'https://empirereport.com' , 'http://empirereport.com'],
  config: {
    screens: {
      TopHeadlines: {
        path: 'TopHeadlines/:id?',
        parse: {
          id: (id) => {
            console.log('Code ', id);
            return `${id}`,
            decodeURIComponent(id)
          },
        },
      },
      DetailedHeadline: {
        path: 'DetailedHeadline/:link?',
        parse: {
          link: (link) => {
            console.log('Code ', link);
            return `${link}`,
            decodeURIComponent(link);
          },
        },
      },
    },
  },
};

const screens = [
 
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
];

class Route extends Component {
  render() {
    return (
      <NavigationContainer linking={linking}>
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
