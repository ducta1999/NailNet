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
          name: 'Order Equipment Supplies',
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
        <Header transparent>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
            <View>
              {/* <Button transparent>
                <Icon
                  name="menu"
                  style={styles.icon}
                  onPress={() => this.onpenDrawer()}
                />
              </Button> */}
              <TouchableOpacity onPress={() => this.onpenDrawer()}>
                <Thumbnail
                  small
                  source={require('../icons/menu.png')}
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Title style={styles.title}>HOME</Title>
            </View>
            <View>
              <Thumbnail
                small
                square
                source={require('../icons/nailtalkpro-app-icon.png')}
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
          {/* <View style={styles.GridViewContainer}> */}
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => this.navigateTo(item.screenName)}>
            {/* <Text style={styles.GridViewTextLayoutName}>{item.name}</Text>
            <Text style={styles.GridViewTextLayoutDescription}>
              {item.description}
            </Text> */}
            <ImageBackground
              source={require('../icons/button_bg.png')}
              style={{
                width: 150,
                height: 160,
                alignItems: 'center',
                justifyContent: 'center',
                //borderRadius: 10
              }}
              imageStyle={{borderRadius: 10}}>
              <Thumbnail
                small
                square
                source={item.uri}
                style={{width: 80, height: 100}}
              />
            </ImageBackground>

            <Text style={styles.GridViewTextLayoutDescription}>
              {item.name}
            </Text>
          </TouchableOpacity>

          {/* </View> */}
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
    backgroundColor: '#1F2426',
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
  },
  GridFinalViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
    width: 50,
    margin: 5,
    backgroundColor: '#1F2426',
  },
  GridViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 50,
    margin: 5,
    //backgroundColor: "#47BFB3"
    backgroundColor: '#1F2426',
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
  },
  //icon: { fontSize: 40 },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});
