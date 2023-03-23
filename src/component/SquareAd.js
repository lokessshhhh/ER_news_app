//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    AppOpenAd,
    BannerAdSize,
    InterstitialAd,
    RewardedAd,
    BannerAd,
    TestIds,
    GAMBannerAd,
  } from 'react-native-google-mobile-ads';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from '../theme/layout';

// create a component
const SquareAd = ({unitId}) => {
    return (
        <View style={{alignSelf:'center',marginVertical:hp(1.5)}}>
          <BannerAd
              unitId={unitId}
              size={BannerAdSize.MEDIUM_RECTANGLE}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
    );
};

export default SquareAd;
