import React, {Component} from 'react';
import {StyleSheet, ImageBackground, Image, ScrollView} from 'react-native';
import {
  Container,
  Content,
  Text,
  ListItem,
  List,
  Thumbnail,
  View,
} from 'native-base';
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
    const menuData = [
      {title: 'Home', route: 'Home'},
      {title: 'FAQs', route: 'Question'},
      {title: 'Promotion', route: 'Promotion'},
      {title: 'Shop', route: 'Shop'},
      {title: 'Classifields', route: 'Classifield'},
      {title: 'Classifields', route: 'Classifield'},
      {title: 'Job', route: 'Job'},
      {title: 'NailTV', route: 'NailTV'},
      {title: 'Conversation', route: 'Conversation'},
      {title: 'Conversation', route: 'Conversation'},
      {title: 'Your post', route: 'Post'},
      {title: 'Profile', route: 'Profile'},
      {title: 'Administrator', route: 'Admin'},
      {title: 'Configuration', route: 'Config'},
    ];
    return (
      <ScrollView>
        <List>
          <ListItem
            selected
            // onPress={() => this.props.navigation.navigate("Home")}
            //  noBorder
          >
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
              <View>
                <Text style={{color: 'white', fontSize: 10}}>
                  {this.state.user ? this.state.user.email : ''}
                </Text>
              </View>

              <View>
                <Text style={styles.menuText}>
                  {this.state.occupation
                    ? this.state.occupation.description
                    : ''}
                </Text>
              </View>
            </View>
          </ListItem>
          <ListItem
            selected
            onPress={() => this.props.navigation.navigate('Home')}
            noBorder>
            <Text style={styles.menuText}>Home</Text>
          </ListItem>
          <ListItem
            onPress={() => this.props.navigation.navigate('Question')}
            noBorder>
            <Text style={styles.menuText}>FAQs</Text>
          </ListItem>
          <ListItem
            noBorder
            onPress={() => this.props.navigation.navigate('Promotion')}>
            <Text style={styles.menuText}>Promotion</Text>
          </ListItem>
          <ListItem
            noBorder
            onPress={() => this.props.navigation.navigate('Shop')}>
            <Text style={styles.menuText}>Shop</Text>
          </ListItem>
          <ListItem
            noBorder
            onPress={() => this.props.navigation.navigate('Classifield')}>
            <Text style={styles.menuText}>Classifields</Text>
          </ListItem>
          <ListItem
            noBorder
            onPress={() => this.props.navigation.navigate('Job')}>
            <Text style={styles.menuText}>Job</Text>
          </ListItem>
          <ListItem
            noBorder
            onPress={() => this.props.navigation.navigate('NailTV')}>
            <Text style={styles.menuText}>NailTV</Text>
          </ListItem>
          <ListItem
            noBorder
            onPress={() => this.props.navigation.navigate('Conversation')}>
            <Text style={styles.menuText}>Conversation</Text>
          </ListItem>
          <ListItem
            noBorder
            onPress={() => this.props.navigation.navigate('Post')}>
            <Text style={styles.menuText}>Your Post</Text>
          </ListItem>
          <ListItem
            noBorder
            onPress={() => this.props.navigation.navigate('Profile')}>
            <Text style={styles.menuText}>Profile</Text>
          </ListItem>
          {this.state.user && this.state.user.occupationID == 2 && (
            <ListItem
              noBorder
              onPress={() => this.props.navigation.navigate('Admin')}>
              <Text style={styles.menuText}>Admin</Text>
            </ListItem>
          )}
          {this.state.user && this.state.user.occupationID == 2 && (
            <ListItem
              noBorder
              onPress={() => this.props.navigation.navigate('Config')}>
              <Text style={styles.menuText}>Config</Text>
            </ListItem>
          )}
          <ListItem onPress={() => this.logout()}>
            <Text style={styles.menuText}>Logout</Text>
          </ListItem>
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  menuTextUser: {
    fontSize: 13,
    color: '#D94526',
    fontWeight: 'bold',
  },
  menuText: {
    fontSize: 15,
    color: '#000',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  thumbnail: {
    marginTop: 10,
    marginBottom: -10,
  },
  container: {
    backgroundColor: '#fff',
  },
});
