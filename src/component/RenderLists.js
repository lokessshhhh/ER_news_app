import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {HomeScreenStyles} from '../screens/HomeScreens/HomeScreenStyles';
import {Img} from '../theme/Img';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../theme/layout';
import {CustomColors} from '../theme/CustomColors';
import { POSTER_INITIAL_ROUTE } from '../utils/Config';
import {
  AppOpenAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  GAMBannerAd,
} from 'react-native-google-mobile-ads';

const RenderLists = ({
  isHorizontalLine,
  isUploadImg,
  onPressShare,
  onPressUrl,
  imgSource,
  textUrl,
  isAd,
  unitId
}) => {
  return (
    <View style={{alignItems: 'center',}}>
 <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: isHorizontalLine === 'Yes' ? 1 : 0,
        marginRight: wp(2.5),
      }}
    >
      <View
        style={{
          width: wp(85),
          marginVertical: hp(1),
          paddingRight: wp(2.5),
        }}
      >
        <TouchableOpacity onPress={onPressUrl}>

        {isUploadImg === '' || isUploadImg === null ? null : (
          <Image
            resizeMode="contain"
            style={HomeScreenStyles.bannerImg}
            source={{
              uri: `${POSTER_INITIAL_ROUTE}${imgSource}`,
            }}
          />
        )}
          <Text
            style={{
              color: CustomColors.black,
              fontSize: hp(2.5),
              textDecorationLine: 'underline',
            }}
          >
            {textUrl}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onPressShare}>
        <Image
          resizeMode="contain"
          style={{height: hp(3.5), width: hp(3.5)}}
          source={Img.share}
        />
      </TouchableOpacity>
    </View>
      {
        isAd ?
        <View style={{marginVertical:hp(1.5)}}>
        <BannerAd
            onAdOpened={()=>{
              console.log('===opened===');
            }}

              unitId={unitId}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
            </View>
            :null
      }
    </View>
   
  );
};

export default RenderLists;
