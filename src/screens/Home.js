import React, {Component} from 'react';
import {
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
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
import Profile from './Profile';
import Shop from './Shop';
import Conversation from './Conversation';

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
        {
          name: 'Conversation',
          description: 'Conversation',
          screenName: 'Conversation',
          uri: require('../icons/icon_conversation.png'),
        },
        {
          name: 'Your Post',
          description: 'Your Post',
          screenName: 'Post',
          uri: require('../icons/icon_post.png'),
        },
        {
          name: 'Administrator',
          description: 'Administrator',
          screenName: 'Admin',
          uri: require('../icons/icon_admin.png'),
        },
        {
          name: 'Configuration',
          description: 'Configuration',
          screenName: 'Config',
          uri: require('../icons/icon_config.png'),
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
    const {height} = Dimensions.get('window');
    const BottomBarStack = getAnimatingBottomBar({
      type: AnimationType.SvgBottomBar,
      navigationScreens: {
        ['Home']: () => (
          <FlatList
            data={this.state.GridListItems}
            renderItem={this.renderItem}
            numColumns={3}
            contentContainerStyle={{
              minHeight: height,
              paddingTop: 24,
              paddingBottom: 111,
            }}
          />
        ),
        ['Shop']: Shop,
        ['Chat']: Conversation,
        ['Profile']: Profile,
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
          curveDepth: 48,
          curveWidth: 99,
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
          activeOpacity={0.79}
          style={{justifyContent: 'center', alignItems: 'center'}}
          onPress={() => this.navigateTo(item.screenName)}>
          {/* <Text style={styles.GridViewTextLayoutName}>{item.name}</Text> */}

          <View style={styles.thumbnailView}>
            <Thumbnail
              small
              square
              source={item.uri}
              style={{width: 36, height: 36}}
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
    backgroundColor: 'rgba(102, 155, 188, 0.123)',
  },
  thumbnailView: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    backgroundColor: 'white',
    shadowColor: '#495057',
    shadowOffset: {
      width: 1,
      height: 9,
    },
    shadowRadius: 40,
    shadowOpacity: 1.0,
    elevation: 12,
  },
  GridViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '33.3%',
    marginVertical: 12,
    padding: 12,
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
    color: '#6c757d',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    marginTop: 18,
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
