//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet ,TextInput} from 'react-native';
  import { CustomColors } from '../theme/CustomColors';
import { HomeScreenStyles } from '../screens/HomeScreens/HomeScreenStyles';


const GreyInput = ({placeholder,onChangeText,value}) => {
    return (
        <TextInput
        onChangeText={onChangeText}
        value={value}
        style={HomeScreenStyles.greyInputStyle}
        placeholderTextColor={CustomColors.tabBG}
        placeholder={placeholder}
      />
    );
};

export default GreyInput;
