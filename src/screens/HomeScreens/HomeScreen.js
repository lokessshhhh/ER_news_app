//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
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
import {ApiBaseUrl} from '../../utils/Config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopHeadlines from '../TopTabScreens/TopHeadlines';

const Tab = createMaterialTopTabNavigator();

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
      IsOnline: false,
      IsLoading: false,
      HeadlinesList: [],
    };
  }

  componentDidMount() {
    this.getNetInfo();
  }

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
        console.log(res.data,'===res===');
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

  render() {
    return (
      <View style={{flex: 1, backgroundColor: CustomColors.white}}>
        <View style={{alignItems: 'center'}}>
          <Image
            resizeMode="contain"
            style={HomeScreenStyles.mainlogo}
            source={Img.applogo}
          />
          <Image
            resizeMode="contain"
            style={HomeScreenStyles.mainlogo}
            source={Img.adlogo}
          />
        </View>

        {this.state.IsIndex === 0 ||
        this.state.IsIndex === 1 ||
        this.state.IsIndex === 2 ? (
          <ScrollView
            style={{flex: 1, marginTop: hp(2.5), marginBottom: hp(10)}}
            contentContainerStyle={{alignItems: 'center'}}
          >
            {this.state.HeadlinesList.map(item => (
              <View
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
                        html:item.content.rendered
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
                      {
                      item.title.rendered
                      .replace(/<[^>]+>/g, '')
                      .replace('&#8230;', '…')
                      .replace('&#8217;', '’')
                      .replace('&#8221;', '”')
                      .replace('&#8211;', '–')
                      .replace('&#8220;', '“')
                      .replace('&#038;', '&')
                      .replace('&amp;', '&')}
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
                    {item.excerpt.rendered
                      .replace(/<[^>]+>/g, '')
                      .replace('&#8230;', '…')
                      .replace('&#8217;', '’')
                      .replace('&#8221;', '”')
                      .replace('&#8211;', '–')
                      .replace('&#8220;', '“')
                      .replace('&#038;', '&')
                      .replace('&amp;', '&')
                      }
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
                      {item._embedded.author[0].name} | {moment(item.date).format('MMMM DD, YYYY')}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={{marginBottom: hp(10), flex: 1}}>
            <Tab.Navigator
              tabBarOptions={{
                pressColor: 'transparent',
              }}
              screenOptions={{
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
                            : CustomColors.tabBG,
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
                            : CustomColors.tabBG,
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
                            : CustomColors.tabBG,
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
                            : CustomColors.tabBG,
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
                      : CustomColors.tabBG,
                },
              ]}
            >
              <Text style={HomeScreenStyles.tabTextStyle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
          <View>
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
                  <GreyInput placeholder={'First Name'} />
                  <GreyInput placeholder={'Last Name'} />
                  <GreyInput placeholder={'Your Email Address'} />
                  <GreyButton ButtonText={'Submit'} />
                </View>
              </View>
            </Modal>

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
                  <GreyInput placeholder={'Name'} />
                  <GreyInput placeholder={'Email'} />
                  <GreyInput placeholder={'Message'} />
                  <GreyButton ButtonText={'Submit'} />
                </View>
              </View>
            </Modal>

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
          </View>
        </View>
      </View>
    );
  }
}

export default HomeScreen;
