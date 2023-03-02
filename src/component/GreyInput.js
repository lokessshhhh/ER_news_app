//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet ,TextInput} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from '../theme/layout';
  import { CustomColors } from '../theme/CustomColors';
import { HomeScreenStyles } from '../screens/HomeScreens/HomeScreenStyles';


const GreyInput = ({placeholder}) => {
    return (
        <TextInput
        style={HomeScreenStyles.greyInputStyle}
        placeholderTextColor={CustomColors.tabBG}
        placeholder={placeholder}
      />
    );
};

export default GreyInput;
