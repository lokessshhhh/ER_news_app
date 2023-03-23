import React, {Component} from 'react';
import {View, Text, Image, ScrollView, FlatList} from 'react-native';
import {HomeScreenStyles} from '../HomeScreens/HomeScreenStyles';
import {Img} from '../../theme/Img';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../theme/layout';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderLists from '../../component/RenderLists';
import Loader from '../../component/Loader';
import NetInfo from '@react-native-community/netinfo';
import Share from 'react-native-share';
import {AdsIds, ApiBaseUrl, Deeplink} from '../../utils/Config';
import {decode} from 'html-entities';
import {
  AppOpenAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  GAMBannerAd,
} from 'react-native-google-mobile-ads';
import SquareAd from '../../component/SquareAd';

class NyState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      HeadlinesList: [],
      IsLoading: true,
      IsOnline: false,
    };
  }

  componentDidMount() {
    this.getNetInfo();
  }

  GetOnlineData = async () => {
    await axios
      .get(`${ApiBaseUrl}posts?categories=8&per_page=30`)
      .then(async res => {
        await AsyncStorage.removeItem('NyState');
        let NewArr = [];
        res.data.map(item => {
          NewArr.push(item.acf);
        });
        await AsyncStorage.setItem('NyState', JSON.stringify(NewArr));
        this.setState({HeadlinesList: NewArr});
        this.setState({
          IsLoading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  GetOfflineData = async () => {
    const Data = await AsyncStorage.getItem('NyState');
    this.setState({
      HeadlinesList: JSON.parse(Data),
      IsLoading: false,
    });
  };

  getNetInfo = () => {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.setState({
          IsLoading: true,
          IsOnline: true,
        });
        this.GetOnlineData();
      } else {
        this.setState({
          IsOnline: false,
          IsLoading: true,
        });
        this.GetOfflineData();
      }
    });
  };

  ShareApp = async Url => {
    const shareOptions = {
      title: 'Share file',
      failOnCancel: false,
      urls: [`${Url}`],
    };
    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log('Result =>', ShareResponse);
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  render() {
    return (
      <View style={HomeScreenStyles.mainBG}>
        <ScrollView>
          <Image
            resizeMode="contain"
            style={[
              HomeScreenStyles.topHeadlineLogo,
              {height: hp(5), width: wp(45), margin: hp(1)},
            ]}
            source={Img.nystate}
          />
            <SquareAd unitId={AdsIds.NY_STATE_AA} />

          <View style={{marginLeft: wp(2.5)}}>
            {this.state.IsLoading === true ? (
              <Loader />
            ) : (
              <FlatList
                scrollEnabled={false}
                data={this.state.HeadlinesList}
                keyExtractor={(item, index) => index}
                renderItem={({item,index}) =>
                  this.state.HeadlinesList ? (
                    item.enter_url === '' ||
                    item.enter_url === null ||
                    item.enter_url.includes('mailto:') ? null : (
                      <RenderLists
                      unitId={AdsIds.GENERAL_SIDEBAR}
                      isAd={index === Math.round((this.state.HeadlinesList.length-1)/2) ? true : false}
                        imgSource={item.upload_image}
                        isHorizontalLine={
                          item.add_horizontal_line_below_the_news
                        }
                        isUploadImg={item.upload_image}
                        onPressShare={() => {
                          this.ShareApp(item.enter_url);
                        }}
                        onPressUrl={() => {
                          this.props.navigation.navigate('DetailedHeadline', {
                            link: item.enter_url,
                          });
                        }}
                        textUrl={decode(item.enter_title)}
                      />
                    )
                  ) : null
                }
              />
            )}
          </View>
          <SquareAd unitId={AdsIds.BOTTOM_ADS} />
        </ScrollView>
      </View>
    );
  }
}

export default NyState;
