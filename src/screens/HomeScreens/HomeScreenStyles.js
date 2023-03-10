import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../theme/layout';
import {CustomColors} from '../../theme/CustomColors';

export const HomeScreenStyles = StyleSheet.create({
  mainBG: {
    flex: 1,
    backgroundColor: CustomColors.white,
  },
  mainlogo: {
    height: hp(10),
    width: wp(90),
  },
  toptanView: {
    borderColor: CustomColors.black,
    borderWidth: 4,
    borderRadius: 10,
    marginHorizontal: wp(-1),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(7),
    width: wp(24),
  },
  tabTextStyle: {
    color: CustomColors.black,
    fontSize: hp(1.8),
    textAlign: 'center',
  },
  footertabView: {
    width: wp(95),
    height:hp(10),
    borderTopWidth: 1,
    borderColor: CustomColors.black,
    position: 'absolute',
    bottom: hp(0),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
  },

  //Top Headlines

  topHeadlineLogo: {
    height: hp(9),
    width: wp(55),
    alignSelf: 'center',
  },
  bannerImg: {
    height: hp(30),
    width: hp(38),
    alignSelf: 'flex-start',
    marginVertical: hp(1.5),
  },

  // Detailed Headlines Screen

  mainHeaderView: {
    height: hp(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp(100),
    backgroundColor: CustomColors.tabBG,
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: wp(5),
  },

  //Register Modal Styles

  submitbutton: {
    backgroundColor: CustomColors.tabBG,
    padding: hp(0.7),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CustomColors.black,
    marginTop: hp(2.5),
    paddingHorizontal: wp(10),
  },
  greyInputStyle: {
    width: wp(80),
    height: hp(6),
    borderWidth: 0.8,
    borderColor: CustomColors.black,
    paddingLeft: wp(2.5),
    color: CustomColors.black,
    marginTop: hp(2.5),
    alignItems: 'center',
    borderRadius: 5,
  },
  registerModalCard: {
    width: wp(90),
    alignSelf: 'center',
    borderWidth: 2,
    alignItems: 'center',
    padding: hp(5),
    borderRadius: 10,
    backgroundColor: CustomColors.white,
  },
});
