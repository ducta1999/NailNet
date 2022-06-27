import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Content,
  Text,
  ListItem,
  List,
  Thumbnail,
  View,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

import * as authentication from '../services/Authentication';
import * as dataService from '../services/DataService';
import * as constant from '../services/Constant';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      occupation: [],
    };
  }

  async componentWillMount() {
    var user = await authentication.getLoggedInUser();

    var occupation = await dataService.get(
      `api/occupations/getoccupation/${user.occupationID}`,
    );

    this.setState({
      user: user,
      occupation: occupation,
      uri:
        constant.BASE_URL +
        'api/avatars/getimage/' +
        user.email +
        '?random_number=' +
        new Date().getTime(),
    });
  }

  async componentWillReceiveProps() {
    var user = await authentication.getLoggedInUser();

    var occupation = await dataService.get(
      `api/occupations/getoccupation/${user.occupationID}`,
    );

    this.setState({
      user: user,
      occupation: occupation,
      uri:
        constant.BASE_URL +
        'api/avatars/getimage/' +
        user.email +
        '?random_number=' +
        new Date().getTime(),
    });
  }

  // async componentDidUpdate() {
  //   var user = await authentication.getLoggedInUser();

  //   this.setState({
  //     user: user
  //   });
  // }

  async logout() {
    await authentication.removeAccount();
    this.props.navigation.navigate('LogIn', {logout: true});
  }
  render() {
    const activeTab =
      this.props?.navigation?.state?.routes[0]?.routes?.slice(-1)[0]?.routeName;

    const {height} = Dimensions.get('window');
    const menuData = [
      {title: 'Home', route: 'Home', icon: 'home-outline'},
      {title: 'FAQs', route: 'Question', icon: 'help-circle-outline'},
      {title: 'Promotion', route: 'Promotion', icon: 'cash-outline'},
      {title: 'Shop', route: 'Shop', icon: 'storefront-outline'},
      {title: 'Classifields', route: 'Classifield', icon: 'albums-outline'},
      {title: 'Job', route: 'Job', icon: 'medkit-outline'},
      {title: 'NailTV', route: 'NailTV', icon: 'tv-outline'},
      {
        title: 'Conversation',
        route: 'Conversation',
        icon: 'chatbubbles-outline',
      },
      {title: 'Your post', route: 'Post', icon: 'document-outline'},
      {title: 'Profile', route: 'Profile', icon: 'person-outline'},
    ];
    const menu =
      this.state.user && this.state.user.occupationID === 2
        ? [
            ...menuData,
            {title: 'Administrator', route: 'Admin'},
            {title: 'Configuration', route: 'Config'},
          ]
        : menuData;
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            minHeight: height - 136,
          }}>
          <View style={styles.menuView}>
            {menu.map((item, index) => (
              <TouchableOpacity
                style={{
                  marginBottom: 6,
                  borderBottomWidth: item.route === activeTab ? 1.68 : 0,
                  borderColor: item.route === activeTab ? '#003566' : '#adb5bd',
                }}
                key={`menu ${index}`}
                onPress={() => this.props.navigation.navigate(item.route)}>
                <Text
                  style={[
                    styles.menuTxt,
                    {
                      color: item.route === activeTab ? '#003566' : '#adb5bd',
                      fontFamily:
                        item.route === activeTab
                          ? 'Montserrat-SemiBold'
                          : 'Montserrat-Regular',
                    },
                  ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <Thumbnail
                source={require('../icons/Avatar.png')}
                style={{width: 36, height: 36}}
              />
              <View style={{paddingLeft: 12}}>
                <Text style={styles.userTxt}>
                  {this.state.user ? this.state.user.email : ''}
                </Text>
                <Text style={styles.roleTxt}>
                  {this.state.occupation
                    ? this.state.occupation.description
                    : ''}
                </Text>
              </View>
            </View>
            <TouchableWithoutFeedback onPress={() => this.logout()}>
              <Icon name="exit-outline" color="#f94144" size={22} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 99,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userTxt: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#03071e',
  },
  roleTxt: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 10,
    color: '#adb5bd',
  },
  menuView: {
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 12,
    borderColor: '#e5e5e568',
    borderBottomWidth: 1.111,
    marginVertical: 24,
  },
  menuTxt: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    color: '#6c757d',
    padding: 12,
  },
});
