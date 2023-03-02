//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HomeScreenStyles } from '../screens/HomeScreens/HomeScreenStyles';
import IconButton from './IconButton';

// create a component
const MainHeader = ({onPressLeft,ImgRight,ImgLeft,onPressRight}) => {
    return (
        <View
        style={HomeScreenStyles.mainHeaderView}
      >
        <IconButton
        onPress={onPressLeft}
       source={ImgLeft}
       />
       <IconButton
       onPress={onPressRight}
       source={ImgRight}
       />
      </View>
    );
};

export default MainHeader;
