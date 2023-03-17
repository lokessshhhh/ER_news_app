import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
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
import {CustomColors} from '../../theme/CustomColors';
import {htmlToText} from 'html-to-text';

class OriginalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnline: false,
      offlineText: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getNetInfo();
  }

  getNetInfo = () => {
    const options = {
      wordwrap: 130,
      selectors: [
        {selector: 'img', format: 'skip'},
        {selector: 'a.button', format: 'skip'},
      ],
    };
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.setState({
          isOnline: true,
        });
      } else {
        this.setState({
          isOnline: false,
          offlineText: htmlToText(this.props.route.params.html, options),
          isLoading: false,
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
                this.setState({
                  isLoading: false,
                });
              }}
              source={{uri: this.props.route.params.link}}
            />
          ) : (
            <ScrollView>
              <Text style={{fontSize: hp(2.5), color: CustomColors.black, margin: hp(2)}}>
                {this.state.offlineText}
              </Text>
            </ScrollView>
          )}
          {this.state.isLoading ? (
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
