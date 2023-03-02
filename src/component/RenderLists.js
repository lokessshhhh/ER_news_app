import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {HomeScreenStyles} from '../screens/HomeScreens/HomeScreenStyles';
import {Img} from '../theme/Img';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../theme/layout';
import {CustomColors} from '../theme/CustomColors';

const RenderLists = ({
  isHorizontalLine,
  isUploadImg,
  onPressShare,
  onPressUrl,
  imgSource,
  textUrl,
}) => {
  return (
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
        {isUploadImg === '' || isUploadImg === null ? null : (
          <Image
            resizeMode="stretch"
            style={HomeScreenStyles.bannerImg}
            source={{
              uri: `http://104.152.168.42/~healthca/staging-empire-reportny/?p=${imgSource}`,
            }}
          />
        )}
        <TouchableOpacity onPress={onPressUrl}>
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
  );
};

export default RenderLists;
