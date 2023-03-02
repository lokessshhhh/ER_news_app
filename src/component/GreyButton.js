//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {HomeScreenStyles} from '../screens/HomeScreens/HomeScreenStyles';
import {CustomColors} from '../theme/CustomColors';

const GreyButton = ({onPress, ButtonText}) => {
  return (
    <TouchableOpacity onPress={onPress} style={HomeScreenStyles.submitbutton}>
      <Text style={{color: CustomColors.black,fontWeight:'bold'}}>{ButtonText}</Text>
    </TouchableOpacity>
  );
};

export default GreyButton;
