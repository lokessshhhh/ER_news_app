//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet ,TouchableOpacity,Image} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from '../theme/layout';

const IconButton = ({onPress,source}) => {
    
    return (
        <TouchableOpacity
        onPress={onPress}
        >
        <Image
          resizeMode="contain"
          style={{height: hp(3.5), width: hp(3.5)}}
          source={source}
        />
      </TouchableOpacity>
    );
};

export default IconButton;
