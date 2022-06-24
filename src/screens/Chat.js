import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, TextInput, Keyboard} from 'react-native';
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
  Textarea,
  Card,
  Item,
  CardItem,
  Form,
  Label,
  Input,
  Spinner,
} from 'native-base';
import * as dataService from '../services/DataService';
import * as toastService from '../services/ToastService';
import * as authentication from '../services/Authentication';
import * as constant from '../services/Constant';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderEmail: props.navigation.state.params.senderEmail,
      receiverEmail: props.navigation.state.params.receiverEmail,
      // senderEmail: "duydd@vntt.com.vn",
      // receiverEmail: "damducduy.it@gmail.com",
      loading: true,
      conversation: [],
      messages: [],
      message: [],
      sender: [],
      receiver: [],
      user: [],
    };

    this.ensureDataFetched(this.state.senderEmail, this.state.receiverEmail);
    this.addMessage = this.addMessage.bind(this);
  }

  async ensureDataFetched(senderEmail, receiverEmail) {
    var user = await authentication.getLoggedInUser();

    var conversation = await dataService.get(
      `api/conversations/getall?guestemail=${senderEmail}&shopemail=${receiverEmail}`,
    );

    var sender = await dataService.get(
      `api/profiles/getprofilebyemail/${senderEmail}`,
    );
    var receiver = await dataService.get(
      `api/profiles/getprofilebyemail/${receiverEmail}`,
    );

    var messages = [];
    if (conversation.totalItems == 1) {
      messages = await dataService.get(
        `api/messages/getall?conversationID=${conversation.items[0].id}&sortby=createtime&IsSortAscending=true`,
      );
    }

    this.setState({
      user: user,
      conversation: conversation,
      messages: messages,
      loading: false,
      message: [],
      sender: sender,
      receiver: receiver,
    });
  }

  async addMessage() {
    const {conversation, message, senderEmail, receiverEmail} = this.state;
    Keyboard.dismiss();
    this.setState({
      loading: true,
    });

    if (message == '') {
      this.setState({
        loading: false,
      });
      return;
    }

    if (conversation.totalItems == 0) {
      var data = {
        guestEmail: senderEmail,
        shopEmail: receiverEmail,
      };

      var conversationResult = await dataService.post(
        `api/conversations/add`,
        data,
      );

      var messageData = {
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
        body: message,
        conversationID: conversationResult.data.id,
      };

      var messageResult = await dataService.post(
        `api/messages/add`,
        messageData,
      );

      if (messageResult.status == 200) {
        this.ensureDataFetched(senderEmail, receiverEmail);
      } else {
        toastService.error('Error');
      }
    } else {
      var messageData = {
        senderEmail: senderEmail,
        receiverEmail: receiverEmail,
        body: message,
        conversationID: conversation.items[0].id,
      };

      var messageResult = await dataService.post(
        `api/messages/add`,
        messageData,
      );

      if (messageResult.status == 200) {
        this.ensureDataFetched(senderEmail, receiverEmail);
      } else {
        toastService.error('Error');
      }
    }
  }

  render() {
    const {loading, user, messages, message, sender, receiver} = this.state;

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
              <TouchableOpacity onPress={() => this.goTabBack()}>
                <Ionicon name="arrow-back-outline" color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <View>
              {sender && receiver && user.email == receiver.email ? (
                <Title style={styles.headerBodyText}>
                  {sender.firstName + ' ' + sender.lastName}
                </Title>
              ) : (
                <Title style={styles.headerBodyText}>
                  {receiver.firstName + ' ' + receiver.lastName}
                </Title>
              )}
            </View>
            <View />
          </View>
        </Header>
        {loading == false ? (
          <Content>
            <Card transparent>
              {messages.items &&
                messages.items.map((item, i) => (
                  <CardItem
                    style={
                      item.senderEmail != user.email
                        ? styles.carditemAnswerForNotOwn
                        : styles.carditemAnswerForOwn
                    }>
                    <Left>
                      <Thumbnail
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
                      <Body>
                        <Text
                          style={
                            item.senderEmail != user.email
                              ? styles.questionDescriptionForNotOwn
                              : styles.questionDescriptionForOwn
                          }>
                          {item.body}
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>
                ))}
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

        <View style={styles.inputBar}>
          <TextInput
            placeholder="Please enter your message..."
            placeholderTextColor="#848484"
            defaultValue={message}
            onChangeText={text => this.setState({message: text})}
            selectionColor="red"
            style={styles.input}
            multiline={true}
            onSubmitEditing={() => this.addMessage()}
          />

          <Button
            backgroundColor="#47BFB3"
            style={styles.submitButton}
            onPress={() => this.addMessage()}>
            <Text style={styles.submitButtonText}>Send</Text>
          </Button>
        </View>
      </Container>
    );
  }

  goTabBack() {
    this.props.navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  avatar: {
    alignItems: 'center',
  },
  informationView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 40,
  },
  name: {
    fontWeight: 'bold',
    color: '#D94526',
    fontSize: 15,
  },
  information: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  thumbnail: {
    width: 150,
    height: 150,
  },

  headerBodyText: {
    justifyContent: 'center',
    //left: 30,
    fontSize: 20,
    color: '#47BFB3',
    marginTop: 5,
  },

  descriptionView: {
    marginTop: 10,
    marginLeft: 16,
  },
  titleInput: {
    //marginLeft: -70
  },
  card: {
    //marginTop: 20,
    padding: 10,
  },
  cardHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D94526',
  },
  cardHeaderText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardTitle: {
    //marginTop: -20
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButtonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    marginTop: 2,
  },
  thumbnailArrow: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
  carditemAnswerForOwn: {
    backgroundColor: '#38A1F3',
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 80,
    // borderColor: "red",
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
    // bor
  },
  questionDescriptionForOwn: {
    color: 'black',
    fontSize: 18,
  },
  carditemAnswerForNotOwn: {
    backgroundColor: 'black',
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 80,
  },
  questionDescriptionForNotOwn: {
    color: '#D94526',
    fontSize: 18,
  },
  input: {
    color: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
  },
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
    bottom: 0,
    //position: "absolute"
  },
});
