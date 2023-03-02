//import liraries
import React, {Component, useEffect} from 'react';
import {View, Image, ScrollView, FlatList} from 'react-native';
import {HomeScreenStyles} from '../HomeScreens/HomeScreenStyles';
import {Img} from '../../theme/Img';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../theme/layout';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomColors} from '../../theme/CustomColors';
import Loader from '../../component/Loader';
import NetInfo from '@react-native-community/netinfo';
import {ApiBaseUrl, Deeplink} from '../../utils/UtilsLinks';
import RenderLists from '../../component/RenderLists';
import Share from 'react-native-share';

class NycLongIsland extends Component {

  constructor(props) {
    super(props);
    this.state = {
      HeadlinesList: [],
      IsLoading: true,
      IsOnline: false,
    };
  };

  componentDidMount() {
    this.getNetInfo();
  };

  GetOnlineData = async () => {
    await axios
      .get(`${ApiBaseUrl}posts?categories=10&per_page=30`)
      .then(async res => {
        await AsyncStorage.removeItem('NycLongIsland');
        let NewArr = [];
        res.data.map(item => {
          NewArr.push(item.acf);
        });
        await AsyncStorage.setItem('NycLongIsland', JSON.stringify(NewArr));
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
    const Data = await AsyncStorage.getItem('NycLongIsland');
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
      urls: [`${Deeplink}${Url}`],
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
            style={HomeScreenStyles.topHeadlineLogo}
            source={Img.toplogo}
          />

          <View style={{marginLeft: wp(2.5)}}>
            {this.state.IsLoading === true ? (
              <Loader />
            ) : (
              <FlatList
                scrollEnabled={false}
                data={this.state.HeadlinesList}
                renderItem={({item}) =>
                  this.state.HeadlinesList ? (
                    item.enter_url === '' || item.enter_url === null ? null : (
                      <RenderLists
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
                        textUrl={item.enter_title.replace('&#8230','…').replace('&#8217',"’").replace('&#8221',"”")}
                      />
                    )
                  ) : null
                }
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default NycLongIsland;
