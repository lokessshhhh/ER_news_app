import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {HomeScreenStyles} from './HomeScreenStyles';
import {Img} from '../../theme/Img';
import WebView from 'react-native-webview';
import MainHeader from '../../component/MainHeader';
import Share from 'react-native-share';
import NetInfo from '@react-native-community/netinfo';
import Loader from '../../component/Loader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../theme/layout';

class OriginalContent extends Component {
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
          {this.state.isOnline ? (
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
          ) : (
            <WebView
              onLoadEnd={() => {
                setTimeout(() => {
                  this.setState({
                    isLoading: true,
                  });
                }, 1000);
              }}
              source={{html: this.props.route.params.html}}
            />
          )}
          {this.state.isLoading === false ? (
            <View style={{position: 'absolute', top: hp(20), left: wp(45)}}>
              <Loader />
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

export default OriginalContent;
