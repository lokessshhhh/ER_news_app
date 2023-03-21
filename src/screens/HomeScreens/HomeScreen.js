//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import {CustomColors} from '../../theme/CustomColors';
import moment from 'moment';
import {Img} from '../../theme/Img';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../theme/layout';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {HomeScreenStyles} from './HomeScreenStyles';
import NyState from '../TopTabScreens/NyState';
import NycLongIsland from '../TopTabScreens/NycLongIsland';
import BreakingState from '../TopTabScreens/BreakingState';
import GreyInput from '../../component/GreyInput';
import GreyButton from '../../component/GreyButton';
import NetInfo from '@react-native-community/netinfo';
import {Strings} from '../../theme/Strings';
import {AdsIds, ApiBaseUrl, SUBMIT_TIPS_URL} from '../../utils/Config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopHeadlines from '../TopTabScreens/TopHeadlines';
import {openDatabase} from 'react-native-sqlite-storage';
import {decode} from 'html-entities';
import {
  AppOpenAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  GAMBannerAd,
} from 'react-native-google-mobile-ads';

const Tab = createMaterialTopTabNavigator();

const db = openDatabase({name: 'offlineMode'});

const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

const FooterButtonArray = [
  {
    title: 'Orignal Content',
  },
  {
    title: 'Submit Tips',
  },
  {
    title: 'Daily Email Newsletter',
  },
];

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsIndex: null,
      NewsSettler: false,
      SubmitTips: false,
      newssettlerSuccess: false,
      IsOnline: false,
      IsLoading: false,
      HeadlinesList: [],
      message: '',
      name: '',
      email: '',
      notValid: false,
      fname: '',
      lname: '',
      uemail: '',
    };
  }

  componentDidMount() {
    this.getNetInfo();
  }
 
  InitialiseDB = () => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='OrignalContent'`,
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql(
              `DROP TABLE IF EXISTS OrignalContent`,
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
              `CREATE TABLE IF NOT EXISTS OrignalContent(user_id INTEGER PRIMARY KEY AUTOINCREMENT, key VARCHAR(100), data VARCHAR(64,000))`,
              [],
            );
          }
        },
        error => {
          console.log(error, '===err===');
        },
      );
    });
  };

  GetOnlineData = async () => {
    await axios
      .get(`${ApiBaseUrl}pages?per_page=20&_embed`)
      .then(async res => {
        await AsyncStorage.removeItem('OrignalContent');
        this.setState({HeadlinesList: res.data});
        await AsyncStorage.setItem('OrignalContent', JSON.stringify(res.data));
        this.setState({
          IsLoading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  GetOfflineData = async () => {
    const Data = await AsyncStorage.getItem('OrignalContent');
    this.setState({
      HeadlinesList: JSON.parse(Data),
      IsLoading: false,
    });
  };

  getNetInfo = () => {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.setState({
          IsOnline: false,
        });
        this.GetOnlineData();
      } else {
        this.setState({
          IsOnline: true,
        });
        this.GetOfflineData();
      }
    });
  };

  submitTips = () => {
    this.state.name === '' ||
    this.state.email === '' ||
    this.state.message === ''||
    reg.test(this.state.email) === false
      ? this.setState({
          notValid: true,
        })
      : (Linking.openURL(
          `${SUBMIT_TIPS_URL}${this.state.message} ${this.state.name}`,
        ),
        this.setState({
          SubmitTips: false,
          name: '',
          email: '',
          message: '',
          notValid: false,
        }));
  };

  setNewssettler = () => {
    this.state.fname === '' ||
    this.state.lname === '' ||
    this.state.uemail === '' ||
    reg.test(this.state.uemail) === false
      ? this.setState({
          notValid: true,
        })
      : this.setState({
          fname: '',
          lemail: '',
          uemail: '',
          newssettlerSuccess: true,
          NewsSettler: false,
          notValid:false
        });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: CustomColors.white}}>
        <View style={{alignItems: 'center'}}>
          <Image
            resizeMode="contain"
            style={HomeScreenStyles.mainlogo}
            source={Img.applogo}
          />
            <BannerAd
            onAdOpened={()=>{
              console.log('===opened===');
            }}
              unitId={TestIds.BANNER}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
        </View>

        {this.state.IsIndex === 0 ||
        this.state.IsIndex === 1 ||
        this.state.IsIndex === 2 ? (
          <ScrollView
            style={{flex: 1, marginTop: hp(2.5), marginBottom: hp(10)}}
            contentContainerStyle={{alignItems: 'center'}}
          >
            {this.state.HeadlinesList.map((item, index) => (
              <View
                key={index}
                style={{
                  width: wp(90),
                  padding: wp(2.5),
                  marginVertical: hp(2.5),
                  backgroundColor: CustomColors.cardbg,
                }}
              >
                <View style={{marginLeft: wp(2.5)}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('OriginalContent', {
                        link: item.link,
                        html: item.content.rendered,
                      });
                    }}
                  >
                    <Text
                      style={{
                        color: CustomColors.black,
                        fontSize: hp(2.5),
                        textDecorationLine: 'underline',
                      }}
                    >
                      {decode(item.title.rendered)}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    numberOfLines={3}
                    style={{
                      color: CustomColors.black,
                      fontSize: hp(2),
                      marginVertical: hp(1),
                    }}
                  >
                    {decode(item.excerpt.rendered).replace(/<[^>]+>/g, '')}
                    {'...'}
                  </Text>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: CustomColors.cardtext,
                        fontSize: hp(2),
                      }}
                    >
                      By{' '}
                    </Text>

                    <Text
                      style={{
                        color: CustomColors.cardtext,
                        fontSize: hp(2),
                        fontWeight: 'bold',
                      }}
                    >
                      {item._embedded.author[0].name} |{' '}
                      {moment(item.date).format('MMMM DD, YYYY')}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={{flex: 1, marginBottom: hp(10)}}>
            <Tab.Navigator
              screenOptions={{
                tabBarPressColor: 'transparent',
                tabBarStyle: {
                  backgroundColor: 'transparent',
                  elevation: 0,
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  marginHorizontal: wp(2.5),
                  borderBottomWidth: 1,
                  borderColor: CustomColors.black,
                },
                tabBarItemStyle: {
                  paddingTop: 20,
                },
                tabBarIndicatorStyle: {
                  backgroundColor: 'transparent',
                  elevation: 0,
                },
              }}
            >
              <Tab.Screen
                name="TopHeadlines"
                component={TopHeadlines}
                options={{
                  tabBarLabel: ({focused}) => (
                    <View
                      style={[
                        HomeScreenStyles.toptanView,
                        {
                          backgroundColor: focused
                            ? CustomColors.tabmainBG
                            : CustomColors.white,
                        },
                      ]}
                    >
                      <Text style={HomeScreenStyles.tabTextStyle}>
                        TOP HEADLINES
                      </Text>
                    </View>
                  ),
                }}
              />
              <Tab.Screen
                name="FeedScreen"
                component={NyState}
                options={{
                  tabBarLabel: ({focused}) => (
                    <View
                      style={[
                        HomeScreenStyles.toptanView,
                        {
                          backgroundColor: focused
                            ? CustomColors.tabmainBG
                            : CustomColors.white,
                        },
                      ]}
                    >
                      <Text style={HomeScreenStyles.tabTextStyle}>
                        NY STATE
                      </Text>
                    </View>
                  ),
                }}
              />
              <Tab.Screen
                name="FavScreen"
                component={NycLongIsland}
                options={{
                  tabBarLabel: ({focused}) => (
                    <View
                      style={[
                        HomeScreenStyles.toptanView,
                        {
                          backgroundColor: focused
                            ? CustomColors.tabmainBG
                            : CustomColors.white,
                        },
                      ]}
                    >
                      <Text style={HomeScreenStyles.tabTextStyle}>
                        NYC/LONG ISLAND
                      </Text>
                    </View>
                  ),
                }}
              />
              <Tab.Screen
                name="ProfileScreen"
                component={BreakingState}
                options={{
                  tabBarLabel: ({focused}) => (
                    <View
                      style={[
                        HomeScreenStyles.toptanView,
                        {
                          backgroundColor: focused
                            ? CustomColors.tabmainBG
                            : CustomColors.white,
                        },
                      ]}
                    >
                      <Text style={HomeScreenStyles.tabTextStyle}>
                        BREAKING STATEWIDE
                      </Text>
                    </View>
                  ),
                }}
              />
            </Tab.Navigator>
          </View>
        )}

        <View style={HomeScreenStyles.footertabView}>
          {FooterButtonArray.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                index === 2
                  ? this.setState({
                      NewsSettler: true,
                    })
                  : index === 1
                  ? this.setState({
                      SubmitTips: true,
                    })
                  : this.state.IsIndex === null
                  ? this.setState({
                      IsIndex: index,
                    })
                  : index === 0
                  ? this.setState({
                      IsIndex: null,
                    })
                  : null;

                console.log(index, this.state.IsIndex);
              }}
              style={[
                HomeScreenStyles.toptanView,
                {
                  marginHorizontal: wp(0),
                  backgroundColor:
                    this.state.IsIndex === index
                      ? CustomColors.tabmainBG
                      : CustomColors.white,
                },
              ]}
            >
              <Text style={HomeScreenStyles.tabTextStyle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
          <View>
            {/* Email NewsSettler Modal */}

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.NewsSettler}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: CustomColors.opacity07,
                }}
              >
                <View style={HomeScreenStyles.registerModalCard}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        NewsSettler: false,
                      });
                    }}
                    style={{position: 'absolute', right: 10, top: 10}}
                  >
                    <Image
                      resizeMode="contain"
                      style={{height: hp(3.5), width: hp(3.5)}}
                      source={Img.remove}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      color: CustomColors.black,
                      marginLeft: wp(-5),
                    }}
                  >
                    {'SIGN UP FOR EMPIRE REPORT’S DAILY NEWSLETTER'}
                  </Text>
                  <GreyInput
                    onChangeText={value =>
                      this.setState({
                        fname: value,
                      })
                    }
                    value={this.state.fname}
                    placeholder={'First Name'}
                  />
                  {this.state.notValid && this.state.fname === '' ? (
                    <Text style={HomeScreenStyles.errText}>
                      {Strings.fnameAlert}
                    </Text>
                  ) : null}
                  <GreyInput
                    onChangeText={value =>
                      this.setState({
                        lname: value,
                      })
                    }
                    value={this.state.lname}
                    placeholder={'Last Name'}
                  />
                  {this.state.notValid && this.state.lname === '' ? (
                    <Text style={HomeScreenStyles.errText}>
                      {Strings.lnameAlert}
                    </Text>
                  ) : null}
                  <GreyInput
                    onChangeText={value =>
                      this.setState({
                        uemail: value,
                      })
                    }
                    value={this.state.uemail}
                    placeholder={'Your Email Address'}
                  />
                  {this.state.notValid && this.state.uemail === '' ? 
                    <Text style={HomeScreenStyles.errText}>
                      {Strings.emailAlert}
                    </Text>
                   : reg.test(this.state.uemail) === false && this.state.notValid ?
                  ( 
                    <Text style={HomeScreenStyles.errText}>
                      {Strings.validEAlert}
                    </Text>)
                  :
                  null}
                  <GreyButton
                    onPress={() => {
                      this.setNewssettler();
                    }}
                    ButtonText={'Submit'}
                  />
                </View>
              </View>
            </Modal>

            {/* Submit Tips Modal */}

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.SubmitTips}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: CustomColors.opacity07,
                }}
              >
                <View style={HomeScreenStyles.registerModalCard}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        SubmitTips: false,
                      });
                    }}
                    style={{position: 'absolute', right: 10, top: 10}}
                  >
                    <Image
                      resizeMode="contain"
                      style={{height: hp(3.5), width: hp(3.5)}}
                      source={Img.remove}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      color: CustomColors.black,
                      marginLeft: wp(-5),
                    }}
                  >
                    {'YOU CAN SUBMIT YOUR TIPS BELOW'}
                  </Text>
                  <GreyInput
                    onChangeText={value =>
                      this.setState({
                        name: value,
                      })
                    }
                    value={this.state.name}
                    placeholder={'Name'}
                  />
                  {this.state.notValid && this.state.name === '' ? (
                    <Text style={HomeScreenStyles.errText}>
                      {Strings.nameAlert}
                    </Text>
                  ) : null}
                  <GreyInput
                    value={this.state.email}
                    onChangeText={value =>
                      this.setState({
                        email: value,
                      })
                    }
                    placeholder={'Email'}
                  />
                  {this.state.notValid && this.state.email === '' ? (
                    <Text style={HomeScreenStyles.errText}>
                      {Strings.emailAlert}
                    </Text>
                  ) : 
                  reg.test(this.state.email) === false && this.state.notValid ?
                  ( 
                    <Text style={HomeScreenStyles.errText}>
                      {Strings.validEAlert}
                    </Text>)
                  :
                  null}
                  <GreyInput
                    value={this.state.message}
                    onChangeText={value =>
                      this.setState({
                        message: value,
                      })
                    }
                    placeholder={'Message'}
                  />
                  {this.state.notValid && this.state.message === '' ? (
                    <Text style={HomeScreenStyles.errText}>
                      {Strings.msgAlert}
                    </Text>
                  ) : 
                  null}
                  <GreyButton
                    onPress={() => {
                      this.submitTips();
                    }}
                    ButtonText={'Submit'}
                  />
                </View>
              </View>
            </Modal>

            {/* offline Alert Modal */}

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.IsOnline}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: CustomColors.opacity07,
                }}
              >
                <View style={HomeScreenStyles.registerModalCard}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      color: CustomColors.black,
                      marginLeft: wp(-5),
                      marginBottom: hp(2.5),
                    }}
                  >
                    {Strings.offlinealert}
                  </Text>

                  <GreyButton
                    onPress={() => {
                      this.setState({IsOnline: false});
                    }}
                    ButtonText={'OK'}
                  />
                </View>
              </View>
            </Modal>

            {/* Daily Email News Settler Success Modal  */}

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.newssettlerSuccess}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: CustomColors.opacity07,
                }}
              >
                <View style={HomeScreenStyles.registerModalCard}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      color: CustomColors.black,
                      marginLeft: wp(-5),
                      marginBottom: hp(2.5),
                    }}
                  >
                    {Strings.newssettlerSucess}
                  </Text>

                  <GreyButton
                    onPress={() => {
                      this.setState({newssettlerSuccess: false});
                    }}
                    ButtonText={'OK'}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default HomeScreen;
