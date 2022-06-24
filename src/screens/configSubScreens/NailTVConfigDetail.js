import * as authentication from '../../services/Authentication';
import * as dataService from '../../services/DataService';
import * as constant from '../../services/Constant';
import * as toastService from '../../services/ToastService';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Linking} from 'react-native';
import Slideshow from 'react-native-image-slider-show';
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
  Title,
  Textarea,
  Card,
  Item,
  CardItem,
  Form,
  Label,
  Input,
  Spinner,
  Tabs,
  Tab,
  TabHeading,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default class NailTVDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.navigation.state.params.id,
      //id: 1,
      nailTV: [],
      loading: true,
      email: [],
      user: [],
    };

    if (props.navigation.state.params && props.navigation.state.params.id) {
      this.ensureDataFetched(props.navigation.state.params.id);
    }
    //this.ensureDataFetched(1);
  }

  async ensureDataFetched(id) {
    var user = await authentication.getLoggedInUser();
    var email = user.email;

    var nailTV = await dataService.get('api/nailtvs/getnailtv/' + id);

    this.setState({
      nailTV: nailTV,
      loading: false,
      email: email,
      user: user,
    });
  }

  async approveIconClick() {
    var data = {
      ...this.state.nailTV,
      isApproved: true,
    };

    var result = await dataService.put(`api/nailtvs/update/${data.id}`, data);

    if (result.status == 200) {
      toastService.success('Approve nailnet successfully!');
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack();
    } else {
      toastService.error('Error: ' + result.data);
    }
  }

  render() {
    const {loading, nailTV} = this.state;

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
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Ionicon name="arrow-back-outline" color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <View>
              <Title style={styles.headerBodyText}>Nail TV Detail</Title>
            </View>
            <View>
              <TouchableOpacity onPress={() => this.approveIconClick()}>
                <Icon
                  name="check"
                  color="white"
                  size={30}
                  style={styles.caretIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Header>
        {loading == false ? (
          <Content>
            <Card style={{flex: 0, marginTop: 5}} transparent>
              {/* <CardItem style={styles.carditem}>
                <Body />
              </CardItem> */}
              <CardItem style={styles.carditem}>
                <Body>
                  <Text style={styles.title}>{nailTV.title}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text
                    style={styles.link}
                    onPress={() => Linking.openURL(nailTV.url)}>
                    Url: {nailTV.url}
                  </Text>
                </Body>
              </CardItem>

              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.normal}>{nailTV.description}</Text>
                </Body>
              </CardItem>

              <CardItem style={{height: 60, backgroundColor: '#1F2426'}} />
            </Card>
          </Content>
        ) : (
          <View>
            <Spinner color="red" />
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}>
              Loading
            </Text>
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  carditem: {
    backgroundColor: '#1F2426',
  },
  headerBodyText: {
    justifyContent: 'center',
    //left: 30,
    fontSize: 20,
    marginTop: 5,
    color: '#47BFB3',
  },
  tabUnderLine: {
    display: 'none',
    backgroundColor: '#D94526',
  },
  tabHeading: {
    backgroundColor: '#D94526',
    // borderBottomWidth: 1,
    // borderBottomColor: "white"
  },
  tabs: {
    backgroundColor: '#D94526',
    borderWidth: 0,
  },
  title: {
    color: '#D94526',
    fontSize: 30,
    fontWeight: 'bold',
  },
  discount: {
    color: 'red',
    fontSize: 15,
  },
  normal: {
    color: 'white',
    fontSize: 15,
  },
  link: {
    color: 'blue',
    fontSize: 15,
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});
