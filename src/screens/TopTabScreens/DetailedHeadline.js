import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
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
        tx.executeSql(`SELECT * FROM ${item} WHERE key=${JSON.stringify(this.props.route.params.link)}`, [], (tx, results) => {
          this.setState({
            htmlTags:results.rows.item(0).data,
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
      <SafeAreaView style={HomeScreenStyles.mainBG}>
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
                }, 250);
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
                  console.log('=======loaded=====');
                }, 1000);
              }}
              source={{uri: this.props.route.params.link}}
            />
          )}
          {this.state.isLoading === false ? (
            <View style={{position: 'absolute', alignSelf:'center',top:hp(20)}}>
              <View>
                <Loader />
                <Text style={{fontSize: hp(3.5), textAlign: 'center',width:wp(80)}}>
                  Please wait while data is loading
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

export default DetailedHeadline;
