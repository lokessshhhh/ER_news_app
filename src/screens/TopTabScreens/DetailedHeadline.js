import React, {Component} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
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
import {htmlToText} from 'html-to-text';
import {CustomColors} from '../../theme/CustomColors';

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
      ismailTo: false,
    };
  }

  componentDidMount() {
    this.getNetInfo();
    this.getOfflineData();
    console.log(this.props.route, '===route====');
  }

  getOfflineData = () => {
    const options = {
      wordwrap: 130,
      selectors: [
        {selector: 'img', format: 'skip'},
        {selector: 'a.button', format: 'skip'},
      ],
    };

    Tables1.map(item =>
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM ${item} WHERE key=${JSON.stringify(
            this.props.route.params.link,
          )}`,
          [],
          (tx, results) => {
            let text = htmlToText(results.rows.item(0).data, options);
            this.setState({
              htmlTags: text,
            });
          },
        );
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
          isLoading: true,
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
        {!this.state.isOnline ? (
          <ScrollView>
            <Text style={{fontSize: hp(2.5), color: CustomColors.black, margin: hp(2)}}>
              {this.state.htmlTags}
            </Text>
          </ScrollView>
        ) : (
          <WebView
            onLoadEnd={() => {
              this.setState({
                isLoading: true,
              });
            }}
            source={{uri: this.props.route.params.link}}
          />
        )}
        {this.state.isLoading === false ? (
          <View
            style={{position: 'absolute', alignSelf: 'center', top: hp(20)}}>
            <View>
              <Loader />
              <Text
                style={{
                  fontSize: hp(3.5),
                  textAlign: 'center',
                  width: wp(80),
                }}>
                Please wait while data is loading
              </Text>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}

export default DetailedHeadline;
