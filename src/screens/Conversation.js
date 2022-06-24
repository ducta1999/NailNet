import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {
  View,
  Text,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Button,
  Spinner,
  Header,
  Container,
} from 'native-base';
import * as authentication from '../services/Authentication';
import * as dataService from '../services/DataService';
import * as constant from '../services/Constant';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      conversations: [],
      user: [],
      email: [],
    };
  }

  componentDidMount() {
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    var user = await authentication.getLoggedInUser();
    var email = user.email;

    var conversations = await dataService.get(
      `api/conversations/getall?email=${email}`,
    );
    console.log(conversations);
    for (var i = 0; i < conversations.items.length; i++) {
      var guest = await dataService.get(
        `api/profiles/getprofile/${conversations.items[i].guestID}`,
      );

      var shop = await dataService.get(
        `api/profiles/getprofile/${conversations.items[i].shopID}`,
      );

      var latestMessage = await dataService.get(
        `api/messages/getlatestmessage/${conversations.items[i].id}`,
      );

      conversations.items[i] = {
        ...conversations.items[i],
        guestName: guest.firstName + ' ' + guest.lastName,
        shopName: shop.firstName + ' ' + shop.lastName,
        senderEmail: guest.email,
        receiverEmail: shop.email,
        latestMessage: latestMessage.body,
      };
      console.log(conversations.items[i]);
    }

    this.setState({
      conversations: conversations,
      loading: false,
      user: user,
      email: email,
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header hasTabs transparent>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
            <View>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back-outline" color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.title}>NailTV</Text>
            </View>
            <View />
          </View>
        </Header>

        <Content>
          {this.state.loading == false ? (
            <ScrollView>
              <List style={styles.list}>
                {this.state.conversations &&
                  this.state.conversations.items &&
                  this.state.conversations.items.map((item, i) => (
                    <ListItem
                      avatar
                      key={i}
                      noBorder
                      onPress={() => this.gotoChat(item)}>
                      <Left>
                        <Thumbnail
                          small
                          //source={require("../icons/Avatar.png")}
                          defaultSource={{uri: 'avatar'}}
                          source={{
                            uri:
                              constant.BASE_URL +
                              'api/avatars/getimage/' +
                              item.senderEmail +
                              '?random_number=' +
                              new Date().getTime(),
                          }}
                        />
                      </Left>
                      <Body>
                        {this.state.email == item.receiverEmail ? (
                          <Text style={styles.name}>{item.guestName}</Text>
                        ) : (
                          <Text style={styles.name}>{item.shopName}</Text>
                        )}
                        <Text style={styles.category}>
                          {item.latestMessage}
                        </Text>
                      </Body>
                      <Right style={styles.right}>
                        <Button
                          backgroundColor="#47BFB3"
                          style={styles.replyButton}
                          onPress={() => this.gotoChat(item)}>
                          <Text>Open</Text>
                        </Button>
                      </Right>
                    </ListItem>
                  ))}
              </List>
            </ScrollView>
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
        </Content>
      </Container>
    );
  }

  async gotoChat(item) {
    this.props.navigation.navigate('Chat', {
      senderEmail: item.senderEmail,
      receiverEmail: item.receiverEmail,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  name: {
    color: '#D94526',
    fontWeight: 'bold',
  },
  question: {
    color: 'white',
  },
  title: {
    fontSize: 15,
    color: '#47BFB3',
    //marginRight: 80,
    marginTop: 10,
  },
  category: {
    color: '#47BFB3',
    fontSize: 12,
  },
  footerGroupText: {
    color: '#47BFB3',
    fontSize: 12,
  },
  footerGroup: {
    flex: 1,
    flexDirection: 'row',
  },
  footerGroupView: {
    marginRight: 20,
  },
  right: {
    marginTop: 15,
    marginLeft: 15,
  },
  replyButton: {
    height: 30,
  },
  list: {
    backgroundColor: '#1F2426',
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});
