//import liraries
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from '../../theme/layout';
import { Img } from '../../theme/Img';

const SplashScreen = ({navigation}) => {

  useEffect(() => {
    setTimeout(() => {
              navigation.replace('HomeScreen');
         }, 4000)
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.splashImageStyle} source={Img.splashScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashImageStyle: {
    height: hp('100%'),
    width: wp('100%'),
  },
});

export default SplashScreen;
