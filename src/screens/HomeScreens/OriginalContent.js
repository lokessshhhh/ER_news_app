import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {HomeScreenStyles} from './HomeScreenStyles';
import {Img} from '../../theme/Img';
import WebView from 'react-native-webview';
import MainHeader from '../../component/MainHeader';
import Share from 'react-native-share';
import NetInfo from '@react-native-community/netinfo';
import {openDatabase} from 'react-native-sqlite-storage';


class OriginalContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOnline: false,
      htmlTags: '',
    };
  }

  componentDidMount() {
    this.getNetInfo();
  }

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
            <WebView source={{html: this.props.route.params.html}} />
          )}
        </View>
      </View>
    );
  }
}

export default OriginalContent;
