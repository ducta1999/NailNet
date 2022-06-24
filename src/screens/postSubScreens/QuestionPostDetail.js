import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
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
  Icon,
  Spinner,
} from 'native-base';
//import Icon from "react-native-vector-icons/FontAwesome";
import * as authentication from '../../services/Authentication';
import * as dataService from '../../services/DataService';
import * as toastService from '../../services/ToastService';
import * as constant from '../../services/Constant';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default class QuestionPostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.navigation.state.params.id,
      //id: 1,
      loading: true,
      question: [],
      email: [],
      user: [],
    };

    if (props.navigation.state.params && props.navigation.state.params.id) {
      this.ensureDataFetched(props.navigation.state.params.id);
    }
    // this.ensureDataFetched(1);
    this.likePress = this.likePress.bind(this);
    this.openPrivateQuestion = this.openPrivateQuestion.bind(this);
  }

  async ensureDataFetched(id) {
    var user = await authentication.getLoggedInUser();
    var email = user.email;

    var question = await dataService.get(
      'api/faqquestions/getfaqquestion/' + id,
    );

    for (var i = 0; i < question.answers.length; i++) {
      question.answers[i].like =
        question.answers[i].like != null && question.answers[i].like != ''
          ? question.answers[i].like.split('|')
          : new Array();
    }

    this.setState({
      question: question,
      loading: false,
      email: email,
      user: user,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params != undefined) {
      if (nextProps.navigation.state.params.addQuestionSuccess == true) {
        this.setState({
          loading: true,
        });
        this.ensureDataFetched(this.state.id);
      }
    }
  }

  render() {
    const {loading, question, id, email, user} = this.state;

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
              <Title style={styles.headerBodyText}>Detail</Title>
            </View>
            <View>
              <TouchableOpacity onPress={() => this.removeIconClick()}>
                <Icon
                  name="trash"
                  style={{fontSize: 30, color: 'white'}}
                  //style={styles.caretIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Header>
        {loading == false ? (
          <Content>
            <Card style={{flex: 0}} transparent>
              <CardItem style={styles.carditem}>
                <Left>
                  <Thumbnail
                    //source={require("../../icons/Avatar.png")}
                    defaultSource={{uri: 'avatar'}}
                    source={{
                      uri:
                        constant.BASE_URL +
                        'api/avatars/getimage/' +
                        question.createByEmail +
                        '?random_number=' +
                        new Date().getTime(),
                    }}
                  />
                  <Body>
                    <Text style={styles.title}>{question.title}</Text>
                    <Text style={styles.createTime}>{question.fullName}</Text>
                    <Text style={styles.createTime}>{question.createTime}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem style={styles.carditem}>
                <Body>
                  <Text style={styles.description}>{question.description}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem}>
                <Text style={styles.category}>
                  Category: {question.industry.description}
                </Text>

                <Text style={styles.view}>View: {question.view}</Text>

                <Text style={styles.asnwerNumber}>
                  Answer: {question.answers.length}
                </Text>
              </CardItem>
              {/* answer for public */}
              {question.private == false &&
                question.answers.map((answer, i) => (
                  <TouchableOpacity
                    onPress={() =>
                      answer.isPro
                        ? this.openPrivateQuestion(
                            answer.createBy,
                            question.industry.description,
                            question.industry.id,
                          )
                        : null
                    }>
                    <CardItem style={styles.carditemAnswer}>
                      <Left>
                        <Thumbnail
                          //source={require("../../icons/Avatar.png")}
                          defaultSource={{uri: 'avatar'}}
                          source={{
                            uri:
                              constant.BASE_URL +
                              'api/avatars/getimage/' +
                              answer.createByEmail +
                              '?random_number=' +
                              new Date().getTime(),
                          }}
                        />
                        <Body>
                          <Text style={styles.questionDescription}>
                            {answer.answerDescription}
                          </Text>
                          <View style={{flex: 1, flexDirection: 'row'}}>
                            <View>
                              <Text style={styles.createTime}>
                                {answer.createTime}
                              </Text>
                              <Text style={styles.createTime}>
                                {answer.fullName}
                              </Text>
                              {answer.isPro && (
                                <Text style={styles.isPro}>Pro</Text>
                              )}
                            </View>

                            <Button
                              iconLeft
                              light
                              transparent
                              style={{
                                justifyContent: 'flex-end',
                                flex: 1,
                              }}>
                              {answer.like.includes(email) ? (
                                <TouchableOpacity
                                  onPress={() => this.likePress(answer)}>
                                  <Icon name="heart" />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => this.likePress(answer)}>
                                  <Icon name="heart-empty" />
                                </TouchableOpacity>
                              )}
                              <Text>{answer.like.length}</Text>
                            </Button>
                          </View>
                        </Body>
                      </Left>
                    </CardItem>
                  </TouchableOpacity>
                ))}

              {/* answer for private */}
              {question.private == true &&
                question.answers.map((answer, i) => (
                  <TouchableOpacity
                    onPress={() =>
                      answer.isPro
                        ? this.openPrivateQuestion(
                            answer.createBy,
                            question.industry.description,
                            question.industry.id,
                          )
                        : null
                    }>
                    <CardItem
                      style={
                        answer.createByEmail != user.email
                          ? styles.carditemAnswerForNotOwn
                          : styles.carditemAnswerForOwn
                      }>
                      <Left>
                        <Thumbnail
                          //source={require("../../icons/Avatar.png")}
                          defaultSource={{uri: 'avatar'}}
                          source={{
                            uri:
                              constant.BASE_URL +
                              'api/avatars/getimage/' +
                              answer.createByEmail +
                              '?random_number=' +
                              new Date().getTime(),
                          }}
                        />
                        <Body>
                          <Text
                            style={
                              answer.createByEmail != user.email
                                ? styles.questionDescriptionForNotOwn
                                : styles.questionDescriptionForOwn
                            }>
                            {answer.answerDescription}
                          </Text>
                          <View style={{flex: 1, flexDirection: 'row'}}>
                            <View>
                              <Text style={styles.createTime}>
                                {answer.createTime}
                              </Text>
                              <Text style={styles.createTime}>
                                {answer.fullName}
                              </Text>
                            </View>

                            <Button
                              iconLeft
                              light
                              transparent
                              style={{justifyContent: 'flex-end', flex: 1}}>
                              {answer.like.includes(email) ? (
                                <TouchableOpacity
                                  onPress={() => this.likePress(answer)}>
                                  <Icon name="heart" />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => this.likePress(answer)}>
                                  <Icon name="heart-empty" />
                                </TouchableOpacity>
                              )}
                              <Text>{answer.like.length}</Text>
                            </Button>
                          </View>
                        </Body>
                      </Left>
                    </CardItem>
                  </TouchableOpacity>
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
      </Container>
    );
  }

  async removeIconClick() {
    Alert.alert(
      'Delete Confirm',
      'Would you like to delete this item?',
      [
        {
          text: 'NO, thanks',
        },
        {
          text: 'OK',
          onPress: async () => {
            var result = await dataService.remove(
              `api/faqquestions/delete/${this.state.question.id}`,
            );

            if (result.status == 200) {
              toastService.success('Delete question successfully!');
              this.props.navigation.state.params.onGoBack();
              this.props.navigation.goBack();
            } else {
              toastService.error('Error: ' + result.data);
            }
          },
        },
      ],
      {cancelable: false},
    );
  }

  async likePress(answer) {
    var user = await authentication.getLoggedInUser();
    var newAnswer = this.state.question.answers.find(i => i.id == answer.id);

    if (newAnswer.like.includes(user.email)) {
      newAnswer.like = newAnswer.like.filter(l => l != user.email);
      if (newAnswer.like == '') {
        newAnswer.like = new Array();
      }
    } else {
      newAnswer.like.push(user.email);
    }

    this.updateView(newAnswer, answer.id);

    var question = this.state.question;
    for (var i = 0; i < question.answers.length; i++) {
      if (question.answers[i].id == answer.id) {
        question.answers[i] = newAnswer;
      }
    }

    this.setState({question: question});
  }

  async updateView(newAnswer, id) {
    var like = newAnswer.like.join('|');
    if (like.trim() == '') {
      like = null;
    }
    var res = await dataService.put(
      `api/faqanswers/updatelike/${id}/${like}`,
      null,
    );
  }

  openPrivateQuestion(id, description, industryID) {
    this.props.navigation.navigate('DoctorDetail', {
      id: id,
      description: description,
      industryID: industryID,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },

  headerBodyText: {
    justifyContent: 'center',
    //left: 30,
    fontSize: 20,
    marginTop: 5,
    color: '#47BFB3',
  },
  carditem: {
    backgroundColor: '#1F2426',
  },
  carditemAnswer: {
    marginTop: 20,
    backgroundColor: '#1F2426',
    marginLeft: 20,
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
  title: {
    color: '#D94526',
    fontSize: 22,
  },
  questionDescription: {
    color: '#D94526',
    fontSize: 18,
  },
  createTime: {
    color: 'white',
    fontSize: 15,
    justifyContent: 'flex-end',
  },
  isPro: {
    color: 'red',
    fontSize: 12,
    justifyContent: 'flex-end',
  },
  asnwerNumber: {
    color: 'white',
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  category: {
    color: 'white',
    fontSize: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  view: {
    color: 'white',
    fontSize: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  description: {
    color: 'white',
    fontSize: 20,
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});
