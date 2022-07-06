import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
  Textarea,
  Card,
  Item,
  CardItem,
  Form,
  Label,
  Input,
  Spinner,
} from 'native-base';
import * as authentication from '../../services/Authentication';
import * as dataService from '../../services/DataService';
import * as constant from '../../services/Constant';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Loading from '../Components/Loading';
import moment from 'moment';
import ExplodingHeart from '../Components/ExplodingHeart';
import LottieButton from '@ocean28799/react-native-lottie-button';
import * as toastService from '../../services/ToastService';
import LottieView from 'lottie-react-native';

export default class QuestionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.navigation.state.params.id,
      //id: 1,
      loading: true,
      question: [],
      email: [],
      user: [],
      comment: '',
      buttonLoading: false,
    };
    this.scrollViewRef = React.createRef();

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
      comment: '',
    });
  }

  async submit() {
    try {
      this.setState({buttonLoading: true});
      const {comment, id} = this.state;

      if (comment.trim() == '') {
        return;
      }

      var user = await authentication.getLoggedInUser();

      var data = {
        answerDescription: comment,
        createByEmail: user.email,
        questionID: id,
      };

      var result = await dataService.post('api/faqanswers/add', data);
      if (result.status === 200) {
        await this.ensureDataFetched(this.state.id);
        this.scrollViewRef?.scrollToEnd({animated: true});
      } else {
        toastService.error(
          'Error: ' + 'Something wrong! Please check and try again',
        );
      }
    } catch (error) {
      toastService.error('Error: ' + error);
    } finally {
      this.setState({buttonLoading: false});
    }
  }

  render() {
    const {loading, question, id, email, user} = this.state;
    const {width} = Dimensions.get('window');
    return (
      <Container style={styles.container}>
        <Header transparent>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 12,
            }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicon name="close" color="#00081499" size={27} />
            </TouchableOpacity>
          </View>
        </Header>
        {loading == false ? (
          <ScrollView
            ref={ref => (this.scrollViewRef = ref)}
            style={{padding: 12}}>
            <View style={[styles.row]}>
              <View style={[styles.row]}>
                <Image
                  source={require('../../icons/Avatar.png')}
                  // source={{
                  //   uri:
                  //     constant.BASE_URL +
                  //     'api/avatars/getimage/' +
                  //     question.createByEmail +
                  //     '?random_number=' +
                  //     new Date().getTime(),
                  // }}
                  style={{width: 36, height: 36}}
                />
                <View style={{marginLeft: 14}}>
                  <Text style={styles.nameTxt}>{question.fullName}</Text>
                  <Text style={styles.timeTxt}>
                    {moment(question.createTime, 'DD/MM/YYYY').fromNow()}
                  </Text>
                </View>
              </View>
              <Ionicon name="ellipsis-horizontal" size={22} color="#212529" />
            </View>

            <View style={styles.questionCard}>
              <View style={[styles.row, styles.cardHeader]}>
                <Text style={styles.title}>{question.title}</Text>
                <Text style={styles.category}>
                  {question.industry.description}
                </Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.description}>{question.description}</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.row}>
                  <Ionicon name="eye" size={19.68} color="#343a40" />
                  <Text style={[styles.txtReact, {marginRight: 19}]}>
                    {question.view}
                  </Text>
                  <Ionicon
                    name="chatbox-ellipses"
                    size={19.68}
                    color="#343a40"
                    style={{marginBottom: -2}}
                  />
                  <Text style={styles.txtReact}>{question.answers.length}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#21252924',
                marginVertical: 24,
              }}
            />
            <View
              style={[
                styles.row,
                {justifyContent: 'flex-start', marginBottom: 12},
              ]}>
              <Text style={styles.headerTxt}>Comments</Text>
              <Ionicon color="#001219" name="chevron-down" size={22} />
            </View>
            {question.answers.map((answer, i) => (
              <View
                key={i}
                style={[
                  styles.answerView,
                  {
                    borderBottomWidth:
                      i === question.answers.length - 1 ? 0 : 1,
                  },
                ]}>
                <View style={[styles.row]}>
                  <View style={styles.row}>
                    <View style={{flex: 0.1}}>
                      <Thumbnail
                        defaultSource={{uri: 'avatar'}}
                        // source={{
                        //   uri:
                        //     constant.BASE_URL +
                        //     'api/avatars/getimage/' +
                        //     answer.createByEmail +
                        //     '?random_number=' +
                        //     new Date().getTime(),
                        // }}
                        source={require('../../icons/Avatar.png')}
                        style={{width: 36, height: 36}}
                      />
                      {answer.isPro ? (
                        <View
                          style={{
                            width: '100%',
                            backgroundColor: '#ffbe0b',
                            borderRadius: 4,
                            marginTop: 4,
                          }}>
                          <Text style={styles.proTxt}>PRO</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={{marginLeft: 14, flex: 0.9}}>
                      <Text style={[styles.nameTxt]}>
                        {answer.fullName}
                        {'  '}
                        <Text style={styles.answerTxt}>
                          {answer.answerDescription}
                        </Text>
                      </Text>

                      <Text style={styles.timeTxt}>
                        {moment(answer.createTime, 'DD/MM/YYYY').fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.row]}>
                  <TouchableOpacity
                    style={{opacity: answer.isPro ? 1 : 0}}
                    activeOpacity={0.79}
                    onPress={() =>
                      answer.isPro
                        ? this.openPrivateQuestion(
                            answer.createBy,
                            question.industry.description,
                            question.industry.id,
                          )
                        : null
                    }>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 14.68,
                        color: '#2ec4b6',
                        letterSpacing: -0.68,
                        textDecorationLine: 'underline',
                      }}>
                      Contact
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.row}>
                    <LottieButton
                      width={48}
                      status={answer.like.includes(email)}
                      onPress={() => this.likePress(answer)}
                      activeOpacity={0.68}
                      source={require('../../json/heart.json')}
                    />
                    {/* <ExplodingHeart
                      width={48}
                      status={answer.like.includes(email)}
                      onPress={() => this.likePress(answer)}
                      activeOpacity={0.68}
                    /> */}
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 12.68,
                        color: '#495057',
                      }}>
                      {answer.like.length}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Loading />
        )}
        <View style={[styles.bottomAbsolute, {width: width}]}>
          <View
            style={[
              styles.row,
              {flex: 1, paddingVertical: 12, paddingHorizontal: 22},
            ]}>
            <View style={{width: '88%'}}>
              <Input
                value={this.state.comment}
                style={styles.input}
                placeholder="Type your answer..."
                placeholderTextColor="#5c677d"
                onChangeText={text => this.setState({comment: text})}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.79}
              disabled={
                this.state.buttonLoading || this.state.comment.trim() === ''
              }
              onPress={() => this.submit()}>
              {this.state.buttonLoading ? (
                <LottieView
                  source={require('../../json/loading.json')}
                  autoPlay
                  loop
                  style={{width: 68}}
                />
              ) : (
                <Ionicon
                  name="send"
                  color={
                    this.state.comment.trim() === '' ? '#c5c3c6' : '#00bbf9'
                  }
                  size={22}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Container>
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
    backgroundColor: '#ffffff',
    paddingBottom: 68,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 6,
    paddingLeft: 9,
    fontSize: 12.9,
    fontFamily: 'Montserrat-Medium',
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
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: '#212529',
    letterSpacing: -1,
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
    color: '#2a6f97',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
  view: {
    color: 'white',
    fontSize: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameTxt: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#212529',
    fontSize: 15,
    letterSpacing: -1,
  },
  timeTxt: {
    fontFamily: 'Montserrat-Regular',
    color: '#adb5bd',
    fontSize: 12,
    letterSpacing: -0.68,
    marginTop: 4,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 2,
    borderWidth: 0.2,
    borderColor: '#ccc',
    marginTop: 19,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  cardHeader: {
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#979dacb5',
    borderStyle: 'dotted',
    borderRadius: 1,
  },
  description: {
    fontFamily: 'Montserrat-Regular',
    color: '#212529',
    fontSize: 16,
    letterSpacing: -1,
  },
  cardBody: {
    marginVertical: 9,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#979dacb5',
    borderStyle: 'dotted',
    borderRadius: 1,
  },
  txtReact: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12.68,
    color: '#343a40',
    marginLeft: 4,
  },
  answerTxt: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#001219',
    marginLeft: 4,
  },
  proTxt: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
  answerView: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#343a4012',
    marginHorizontal: 4,
  },
  headerTxt: {
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: -1,
    color: '#001219',
    marginRight: 6,
  },
  bottomAbsolute: {
    height: 68,
    backgroundColor: '#8d99ae24',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
