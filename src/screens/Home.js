import React, {Component} from 'react';
import {
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  Container,
  Content,
  Thumbnail,
  Button,
  View,
  Text,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Title,
} from 'native-base';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import * as authentication from '../services/Authentication';
import {createAppContainer} from 'react-navigation';
import {
  getAnimatingBottomBar,
  AnimationType,
} from 'react-native-animating-bottom-tab-bar';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GridListItems: [
        {
          name: 'FAQs',
          description: 'QUESTION & ANSWER',
          screenName: 'Question',
          uri: require('../icons/icon_faq.png'),
        },
        {
          name: 'Promotion',
          description: 'PROMOTION NAILS',
          screenName: 'Promotion',
          uri: require('../icons/icon_promotion.png'),
        },
        {
          name: 'Order Equipment',
          description: 'ORDER EQUIPMENT SUPPLIES',
          screenName: 'Shop',
          uri: require('../icons/icon_supplies.png'),
        },
        {
          name: 'Classifieds',
          description: 'BUY & SELL',
          screenName: 'Classified',
          uri: require('../icons/icon_classifield.png'),
        },
        {
          name: 'Jobs',
          description: 'JOBS OPPORTUNITY',
          screenName: 'Job',
          uri: require('../icons/icon_jobs.png'),
        },
        {
          name: 'Nail TV',
          description: 'Nail TV',
          screenName: 'NailTV',
          uri: require('../icons/icon_nailtv.png'),
        },
      ],
    };
  }

  async componentWillMount() {
    if ((await authentication.checkAccountExisted()) == false) {
      this.props.navigation.navigate('LogIn');
    } else {
      var user = await authentication.getLoggedInUser();

      if (user.checkCityConfirm == false) {
        Alert.alert(
          'Default location',
          'Would you like to use your current location?',
          [
            {
              text: 'NO, thanks',
              onPress: () =>
                authentication.updateAccountWithcheckCityConfirm(false),
            },
            {
              text: 'OK',
              onPress: () =>
                authentication.updateAccountWithcheckCityConfirm(false),
              //  authentication.updateAccountWithcheckCityConfirm(true)
            },
          ],
          {cancelable: false},
        );
      }
    }
  }

  render() {
    const BottomBarStack = getAnimatingBottomBar({
      type: AnimationType.SvgBottomBar,
      navigationScreens: {
        ['Home']: () => (
          <>
            <Header transparent style={{marginTop: 18}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}>
                <View style={{marginLeft: 9}}>
                  <TouchableOpacity onPress={() => this.onpenDrawer()}>
                    <Thumbnail
                      small
                      source={require('../icons/menu.png')}
                      style={styles.thumbnail}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(102, 155, 188, 0.2)',
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 9,
                  }}>
                  <Thumbnail
                    small
                    square
                    source={require('../icons/customer-service.png')}
                    style={styles.thumbnail}
                  />
                </View>
              </View>
            </Header>
            <Content>
              <FlatList
                data={this.state.GridListItems}
                renderItem={this.renderItem}
                numColumns={2}
              />
            </Content>
          </>
        ),
        ['Shop']: () => <></>,
        ['Chat']: () => <></>,
        ['Profile']: () => <></>,
      },
      navigationParameter: [
        {
          label: 'Home',
          routeName: 'Home',
          icons: {
            unselected: require('../icons/home.png'),
            selected: require('../icons/homeSelected.png'),
          },
          inactiveTextStyle: styles.text,
          activeTextStyle: styles.text,
        },
        {
          label: 'Shop',
          routeName: 'Shop',
          icons: {
            unselected: require('../icons/shop.png'),
            selected: require('../icons/shopSelected.png'),
          },
          inactiveTextStyle: styles.text,
          activeTextStyle: styles.text,
        },
        {
          label: 'Chat',
          routeName: 'Chat',
          icons: {
            unselected: require('../icons/message.png'),
            selected: require('../icons/messageSelected.png'),
          },
          inactiveTextStyle: styles.text,
          activeTextStyle: styles.text,
        },
        {
          label: 'Profile',
          routeName: 'Profile',
          icons: {
            unselected: require('../icons/profile.png'),
            selected: require('../icons/profileSelected.png'),
          },
          inactiveTextStyle: styles.text,
          activeTextStyle: styles.text,
        },
      ],
      configData: {
        bottomBarConfig: {
          backgroundColor: '#fff',
          // height: 79,
          // curveDepth: 36,
          // curveWidth: 99,
        },
      },
    });

    const AppContainer = createAppContainer(BottomBarStack);

    return (
      <Container style={styles.container}>
        <AppContainer />
      </Container>
    );
  }

  renderItem = ({item}) => {
    return (
      <View
        style={styles.GridViewContainer}
        onPress={() => this.navigateTo(item.screenName)}>
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center'}}
          onPress={() => this.navigateTo(item.screenName)}>
          {/* <Text style={styles.GridViewTextLayoutName}>{item.name}</Text> */}

          <View
            style={{
              width: 90,
              height: 90,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 45,
              backgroundColor: 'white',
            }}>
            <Thumbnail
              small
              square
              source={item.uri}
              style={{width: 39, height: 39}}
            />
          </View>

          <Text style={styles.GridViewTextLayoutDescription}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  onpenDrawer() {
    this.props.navigation.openDrawer();
  }

  navigateTo(screenName) {
    if (screenName) {
      this.props.navigation.navigate(screenName);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dee5e7b3',
  },
  GridViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 168,
    width: '48%',
  },
  GridViewTextLayoutName: {
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center',
    color: '#fff',
  },
  GridViewTextLayoutDescription: {
    fontSize: 12,
    justifyContent: 'center',
    color: '#555b6e',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    marginTop: 9,
  },
  title: {
    color: '#47BFB3',
    // marginLeft: 100,
    fontSize: 20,
    marginTop: 5,
    fontFamily: 'Montserrat-SemiBoldItalic',
  },
  //icon: { fontSize: 40 },
  thumbnail: {
    width: 36,
    // height: 25,
    marginTop: 5,
    borderRadius: 0,
  },
  text: {
    color: '#5e60ce',
    fontSize: 12,
  },
});
