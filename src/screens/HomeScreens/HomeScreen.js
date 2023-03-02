//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {CustomColors} from '../../theme/CustomColors';
import {Img} from '../../theme/Img';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../theme/layout';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TopHeadlines from '../TopTabScreens/TopHeadlines';
import {HomeScreenStyles} from './HomeScreenStyles';
import NyState from '../TopTabScreens/NyState';
import NycLongIsland from '../TopTabScreens/NycLongIsland';
import BreakingState from '../TopTabScreens/BreakingState';
import GreyInput from '../../component/GreyInput';
import GreyButton from '../../component/GreyButton';


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
    };
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: CustomColors.white}}>
        <View style={{alignItems: 'center'}}>
          <Image
            resizeMode="contain"
            style={HomeScreenStyles.mainlogo}
            source={Img.mainlogo}
          />
          <Image
            resizeMode="contain"
            style={HomeScreenStyles.mainlogo}
            source={Img.adlogo}
          />
        </View>
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
                    <Text style={HomeScreenStyles.tabTextStyle}>NY STATE</Text>
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

        <View style={HomeScreenStyles.footertabView}>
          { FooterButtonArray.map((item, index) => (
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
                  : null;
                this.setState({
                  IsIndex: index,
                });
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
          <View >
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.NewsSettler}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({NewsSettler: false, IsIndex: 0});
                }}
              >
                <View style={{flex: 1, justifyContent: 'center',backgroundColor:CustomColors.opacity07}}>
                  <View style={HomeScreenStyles.registerModalCard}>
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
              </TouchableWithoutFeedback>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.SubmitTips}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({SubmitTips: false, IsIndex: 0});
                }}
              >
                <View style={{flex: 1, justifyContent: 'center',backgroundColor:CustomColors.opacity07}}>
                  <View style={HomeScreenStyles.registerModalCard}>
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
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </View>
      </View>
    );
  }
}

export default HomeScreen;
