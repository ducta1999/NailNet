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
    return (
      <Container style={styles.container}>
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
            style={styles.flatlist}
          />
        </Content>
      </Container>
    );
  }

  renderItem = ({item}) => {
    if (item.name != 'final') {
      return (
        <View
          style={styles.GridViewContainer}
          onPress={() => this.navigateTo(item.screenName)}>
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => this.navigateTo(item.screenName)}>
            {/* <Text style={styles.GridViewTextLayoutName}>{item.name}</Text> */}

            <ImageBackground
              source={require('../icons/button_bg.png')}
              style={{
                width: 68,
                height: 68,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              imageStyle={{borderRadius: 34}}>
              <Thumbnail
                small
                square
                source={item.uri}
                style={{width: 39, height: 39}}
              />
            </ImageBackground>

            <Text style={styles.GridViewTextLayoutDescription}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.GridViewTextLayoutDescription,
                {fontFamily: 'Montserrat-Medium', fontSize: 11},
              ]}>
              {item.description}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (item.name == 'final') {
      return <View style={styles.GridFinalViewContainer} />;
    }
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
    backgroundColor: '#001d3d',
  },
  GridFinalViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 168,
    width: 50,
    margin: 16,
    //backgroundColor: "#47BFB3"
    backgroundColor: 'rgba(0, 53, 102, 0.68)',
    borderRadius: 24,
    borderRightWidth: 3.9,
    borderBottomWidth: 3.9,
    borderColor: 'rgba(0, 29, 61, 0.79)',
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
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
    marginTop: 9,
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 168,
    width: 50,
    margin: 16,
    //backgroundColor: "#47BFB3"
    backgroundColor: 'rgba(0, 53, 102, 0.79)',
    borderRadius: 24,
    borderRightWidth: 3.9,
    borderBottomWidth: 3.9,
    borderColor: 'rgba(0, 80, 157, 0.79)',
  },
  flatlist: {
    marginTop: 20,
    marginLeft: 5,
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
    width: 25,
    // height: 25,
    marginTop: 5,
    borderRadius: 0,
  },
});
