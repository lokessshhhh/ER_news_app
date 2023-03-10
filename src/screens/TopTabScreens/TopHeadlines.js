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
import {ApiBaseUrl, Deeplink} from '../../utils/Config';
import RenderLists from '../../component/RenderLists';
import {openDatabase} from 'react-native-sqlite-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';

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

  // handleDynamicLink = link => {
  //   // Handle dynamic link inside your own application
  //   if (link.url === 'https://invertase.io/offer') {
  //     // ...navigate to your offers screen
  //   }
  // };

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
              item.acf.enter_url === '' || null
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
                              console.log('== Data fetched successfully 1 ==');
                            }
                          },
                          error => {
                            console.log(error, '==err==');
                          },
                        );
                      });
                    })
                    .catch(err => console.error(err, '====promice err 1=====')),
            );
            secondResponse.data.map(item =>
              item.acf.enter_url === '' || null
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
                              console.log('== Data fetched successfully 2==');
                            }
                          },
                          error => {
                            console.log(error, '==err==');
                          },
                        );
                      });
                    })
                    .catch(err => console.log(err, '====promice err 2=====')),
            );
            thirdResponse.data.map(item =>
              item.acf.enter_url === '' || null
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
                              console.log('== Data fetched successfully 3==');
                            }
                          },
                          error => {
                            console.log(error, '==err==');
                          },
                        );
                      });
                    })
                    .catch(err => console.log(err, '====promice err 3=====')),
            );
            fourthResponse.data.map(item =>
              item.acf.enter_url === '' || null
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
                              console.log('== Data fetched successfully 4==');
                            }
                          },
                          error => {
                            console.log(error, '==err==');
                          },
                        );
                      });
                    })
                    .catch(err => console.log(err, '====promice err 4=====')),
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
            source={Img.topheadline}
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
                        textUrl={item.enter_title
                          .replace(/<[^>]+>/g, '')
                          .replace('&#8230;', '…')
                          .replace('&#8217;', '’')
                          .replace('&#8221;', '”')
                          .replace('&#8211;', '–')
                          .replace('&#8220;', '“')
                          .replace('&#038;', '&')
                          .replace('&amp;', '&')
                        }
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

export default TopHeadlines;
