import React, {Component} from 'react';
import {View, Image, ScrollView, FlatList} from 'react-native';
import {HomeScreenStyles} from '../HomeScreens/HomeScreenStyles';
import {Img} from '../../theme/Img';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../theme/layout';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../component/Loader';
import NetInfo from '@react-native-community/netinfo';
import Share from 'react-native-share';
import {AdsIds, ApiBaseUrl, Deeplink} from '../../utils/Config';
import RenderLists from '../../component/RenderLists';
import {openDatabase} from 'react-native-sqlite-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {decode} from 'html-entities';
import {htmlToText} from 'html-to-text';
import SquareAd from '../../component/SquareAd';
import { TestIds } from 'react-native-google-mobile-ads';

const db = openDatabase({name: 'offlineMode'});

const urls = [
  `${ApiBaseUrl}posts?categories=6&per_page=30`,
  `${ApiBaseUrl}posts?categories=8&per_page=30`,
  `${ApiBaseUrl}posts?categories=10&per_page=30`,
  `${ApiBaseUrl}posts?categories=9&per_page=30`,
];

const Tables = [
  'topHeadlines',
  'NYstate',
  'NYCLongIsland',
  'breakingStatewide',
];

const requests = urls.map(url => axios.get(url));

class TopHeadlines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      HeadlinesList: [],
      IsLoading: true,
      IsOnline: false,
    };
  }

  componentDidMount() {
    // dynamicLinks().onLink(this.handleDynamicLink());
    // // When the component is unmounted, remove the listener
    this.props.route.params
      ? this.props.route.params.id !== '' || null
        ? this.props.navigation.navigate('DetailedHeadline', {
            link: this.props.route.params.id,
          })
        : console.log('No link found')
      : null;
    this.getNetInfo();
    // this.buildLink();
  }

  buildLink = async () => {
    const link = await dynamicLinks().buildLink({
      link: 'https://invertase.io',
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://empirereport.page.link',
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });
    console.log(link, '====link====');
    return link;
  };

  InitialiseDB = () => {
    Tables.map(item =>
      db.transaction(txn => {
        txn.executeSql(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='${item}'`,
          [],
          (tx, res, res2, res3, res4) => {
            console.log('item:', res.rows.length);
            if (res.rows.length == 0) {
              txn.executeSql(
                `DROP TABLE IF EXISTS ${item}`,
                [],
                (tx, results) => {
                  if (results && results.rows && results.rows._array) {
                    console.log(JSON.stringify(results.rows._array));
                  } else {
                    console.log('no results');
                  }
                },
                (tx, error) => {
                  console.log(error);
                },
              );
              txn.executeSql(
                `CREATE TABLE IF NOT EXISTS ${item}(user_id INTEGER PRIMARY KEY AUTOINCREMENT, key VARCHAR(100), data VARCHAR(64,000))`,
                [],
              );
            }
          },
          error => {
            console.log(error, '===err===');
          },
        );
      }),
    );
  };

  SaveAllDataOffline = async () => {
    await axios
      .all(requests)
      .then(
        axios.spread(
          (firstResponse, secondResponse, thirdResponse, fourthResponse) => {

            firstResponse.data.map(item =>
              item.acf.enter_url === '' || null || item.acf.enter_url.includes('mailto:')
                ? null
                : fetch(item.acf.enter_url)
                    .then(response => response.text())
                    .then(async responseData => {
                      db.transaction(function (tx) {
                        tx.executeSql(
                          'INSERT INTO topHeadlines (key, data) VALUES (?,?)',
                          [item.acf.enter_url, responseData],
                          (tx, results) => {
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                            }
                          },
                          error => {
                            console.log(error);
                          },
                        );
                      });
                    })
                    .catch(err => console.error(err)),
            );
            secondResponse.data.map(item =>
              item.acf.enter_url === '' || null || item.acf.enter_url.includes('mailto:')
                ? null
                : fetch(item.acf.enter_url)
                    .then(response => response.text())
                    .then(async responseData => {
                      db.transaction(function (tx) {
                        tx.executeSql(
                          'INSERT INTO NYstate (key, data) VALUES (?,?)',
                          [item.acf.enter_url, responseData],
                          (tx, results) => {
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                            }
                          },
                          error => {
                            console.log(error);
                          },
                        );
                      });
                    })
                    .catch(err => console.log(err)),
            );
            thirdResponse.data.map(item =>
              item.acf.enter_url === '' || null || item.acf.enter_url.includes('mailto:')
                ? null
                : fetch(item.acf.enter_url)
                    .then(response => response.text())
                    .then(async responseData => {
                      db.transaction(function (tx) {
                        tx.executeSql(
                          'INSERT INTO NYCLongIsland (key, data) VALUES (?,?)',
                          [item.acf.enter_url, responseData],
                          (tx, results) => {
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                            }
                          },
                          error => {
                            console.log(error);
                          },
                        );
                      });
                    })
                    .catch(err => console.log(err)),
            );
            fourthResponse.data.map(item =>
              item.acf.enter_url === '' || null || item.acf.enter_url.includes('mailto:')
                ? null
                : fetch(item.acf.enter_url)
                    .then(response => response.text())
                    .then(async responseData => {
                      db.transaction(function (tx) {
                        tx.executeSql(
                          'INSERT INTO breakingStatewide (key, data) VALUES (?,?)',
                          [item.acf.enter_url, responseData],
                          (tx, results) => {
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                            }
                          },
                          error => {
                            console.log(error);
                          },
                        );
                      });
                    })
                    .catch(err => console.log(err)),
            );
          },
        ),
      )
      .catch(error => console.log(error));
  };

  GetOnlineData = async () => {
    await axios
      .get(`${ApiBaseUrl}posts?categories=6&per_page=30`)
      .then(async res => {
        await AsyncStorage.removeItem('TopHeadlines');
        let NewArr = [];
        res.data.map(item => {
          NewArr.push(item.acf);
        });
        await AsyncStorage.setItem('TopHeadlines', JSON.stringify(NewArr));
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
    const Data = await AsyncStorage.getItem('TopHeadlines');
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
        this.InitialiseDB();
        this.SaveAllDataOffline();
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
            style={HomeScreenStyles.topHeadlineLogo}
            source={Img.topheadline}
          />
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
                    item.enter_url === '' || item.enter_url === null || item.enter_url.includes('mailto:') ? null : (
                      <RenderLists
                        unitId={TestIds.BANNER}
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

export default TopHeadlines;
