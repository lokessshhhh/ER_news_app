import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {HomeScreenStyles} from '../HomeScreens/HomeScreenStyles';
import {Img} from '../../theme/Img';
import WebView from 'react-native-webview';
import MainHeader from '../../component/MainHeader';
import Share from 'react-native-share';
import NetInfo from '@react-native-community/netinfo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../theme/layout';
import Loader from '../../component/Loader';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'offlineMode'});

const Tables1 = [
  'topHeadlines',
  'NYstate',
  'NYCLongIsland',
  'breakingStatewide',
];

class DetailedHeadline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnline: false,
      htmlTags: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    this.getNetInfo();
    this.getOfflineData();
    console.log(this.props.route, '===route====');
  }

  getOfflineData = () => {
    Tables1.map(item =>
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM ${item}`, [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          let htmlData = temp.filter(
            item => item.key === this.props.route.params.link,
          );
          htmlData.map(item => {
            this.setState({
              htmlTags: item.data,
            });
          });
        });
      }),
    );
  };

  getNetInfo = () => {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.setState({
          isOnline: true,
        });
      } else {
        this.setState({
          isOnline: false,
        });
      }
    });
  };

  ShareApp = async Url => {
    const shareOptions = {
      title: 'Share file',
      failOnCancel: false,
      urls: [`https://empirereport.com/TopHeadlines?id=${Url}`],
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
        <MainHeader
          onPressRight={() => {
            this.ShareApp(this.props.route.params.link);
          }}
          onPressLeft={() => {
            this.props.navigation.goBack();
          }}
          ImgLeft={Img.back}
          ImgRight={Img.share}
        />
        <View style={{flex: 1}}>
          {!this.state.isOnline ? (
            <WebView
              onLoadEnd={() => {
                setTimeout(() => {
                  this.setState({
                    isLoading: true,
                  });
                }, 2000);
              }}
              source={{html: this.state.htmlTags}}
            />
          ) : (
            <WebView
              onLoadEnd={() => {
                setTimeout(() => {
                  this.setState({
                    isLoading: true,
                  });
                }, 1000);
              }}
              source={{uri: this.props.route.params.link}}
            />
          )}
          {this.state.isLoading === false ? (
            <View style={{position: 'absolute', top: hp(18), left: wp(13)}}>
              <View>
                <Loader />
                <Text style={{fontSize: hp(3.5), textAlign: 'center'}}>
                  Please wait while data is loading
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

export default DetailedHeadline;
