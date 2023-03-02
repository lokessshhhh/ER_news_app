//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,ActivityIndicator } from 'react-native';
import { CustomColors } from '../theme/CustomColors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from '../theme/layout';

const Loader = () => {
    return (
        <View style={{alignSelf:'center',justifyContent:'center',marginTop:hp(20)}}>
        <ActivityIndicator color={CustomColors.black} size={50} />
      </View>
    );
};

export default Loader;
