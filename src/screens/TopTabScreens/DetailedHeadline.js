import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {HomeScreenStyles} from '../HomeScreens/HomeScreenStyles';
import {Img} from '../../theme/Img';
import WebView from 'react-native-webview';
import MainHeader from '../../component/MainHeader';
import Share from 'react-native-share';
import NetInfo from '@react-native-community/netinfo';
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
      links: [],
      isOnline: false,
      htmlTags: '',
    };
  }

  componentDidMount() {
    this.getNetInfo();
    this.getOfflineData();
  }

  getOfflineData = () => {
    Tables1.map(item =>
      db.transaction(tx => {
        tx.executeSql(`SELECT * FROM ${item}`, [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          this.setState({
            links: temp,
          });
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
          {this.state.isOnline ? (
            <WebView source={{uri: this.props.route.params.link}} />
          ) : (
            <WebView source={{html: this.state.htmlTags}} />
          )}
        </View>
      </View>
    );
  }
}

export default DetailedHeadline;
