import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
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
} from 'native-base';
import * as authentication from '../../services/Authentication';
import * as constant from '../../services/Constant';
import * as dataService from '../../services/DataService';
import LottieView from 'lottie-react-native';
import Loading from '../Components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

export default class PublicQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      questions: [],
    };

    this.gotoQuestionDetail = this.gotoQuestionDetail.bind(this);
  }

  componentDidMount() {
    // this.props.onChangeTab(1);
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    var user = await authentication.getLoggedInUser();

    var items = await dataService.get(
      `api/faqquestions/getall?isApproved=true&private=false&sortby=createtime`,
    );

    console.log(items);

    this.setState({
      questions: items,
      loading: false,
    });
  }

  openAddQuestionPage() {
    this.props.navigation.navigate('AddQuestionPublic');
  }

  render() {
    const {height} = Dimensions.get('window');

    return (
      <Content style={{backgroundColor: '#fff'}}>
        <Header hasTabs searchBar transparent>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}>
              <Image
                source={require('../../icons/menu.png')}
                style={{width: 29, height: 29}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.openAddQuestionPage()}>
              <View style={{width: 68, height: 68}}>
                <LottieView
                  source={require('../../json/create.json')}
                  autoPlay
                  loop
                />
              </View>
            </TouchableOpacity>
          </View>
        </Header>
        {this.state.loading == false ? (
          <ScrollView style={{padding: 12, marginBottom: 88}}>
            {this.state.questions &&
              this.state.questions.items &&
              this.state.questions.items.map((item, i) => (
                <TouchableOpacity
                  activeOpacity={0.79}
                  key={i}
                  style={{marginBottom: 26}}
                  onPress={() => this.gotoQuestionDetail(item.id)}>
                  <View style={[styles.questionCard]}>
                    <View style={[styles.row, styles.cardHeader]}>
                      <Text style={styles.title}>{item.title}</Text>
                      <View style={styles.row}>
                        <Text style={styles.category}>
                          {item.industry.description}
                        </Text>
                        <Icon
                          name="chevron-forward-outline"
                          size={18}
                          color="#979dac"
                        />
                      </View>
                    </View>
                    <View style={[styles.row, styles.cardBody]}>
                      <View style={styles.itemBody2}>
                        <Text style={styles.subTitle}>Name</Text>
                        <Text style={styles.subTxt}>{item.fullName}</Text>
                      </View>

                      <View style={styles.itemBody2}>
                        <Text style={styles.subTitle}>Post Date</Text>
                        <Text style={styles.subTxt}>
                          {moment(item.createTime, 'DD/MM/YYYY').format('ll')}
                        </Text>
                      </View>

                      <View style={styles.itemBody1}>
                        <Text style={styles.subTitle}>View</Text>
                        <Text style={styles.subTxt}>{item.view}</Text>
                      </View>

                      <View style={styles.itemBody1}>
                        <Text style={styles.subTitle}>Answer</Text>
                        <Text style={styles.subTxt}>{item.answers.length}</Text>
                      </View>
                    </View>
                    <View style={{width: '100%'}}>
                      <Text style={styles.subTitle}>Description</Text>
                      <Text
                        style={styles.question}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        {item.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        ) : (
          <Loading />
        )}
      </Content>
    );
  }

  async gotoQuestionDetail(id) {
    var questions = this.state.questions;
    questions.items.find(i => i.id == id).view++;

    this.setState({
      questions: questions,
    });

    await dataService.put(`api/faqquestions/updateview/${id}`, null);

    this.props.navigation.navigate('QuestionDetail', {
      id: id,
    });
  }
}

const styles = StyleSheet.create({
  name: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#000',
  },
  question: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontSize: 12.68,
  },
  title: {
    color: '#000',
    fontSize: 19,
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: -1.23,
  },
  category: {
    color: '#2a6f97',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
    marginRight: 12,
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
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
    borderRadius: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 2,
    borderWidth: 0.2,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  subTitle: {
    fontFamily: 'Montserrat-Regular',
    color: '#6c757d',
    fontSize: 12.68,
    letterSpacing: -1,
    marginBottom: 4,
  },
  cardHeader: {
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#979dacb5',
    borderStyle: 'dotted',
    borderRadius: 1,
  },
  cardBody: {
    marginVertical: 9,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#979dacb5',
    borderStyle: 'dotted',
    borderRadius: 1,
  },
  itemBody1: {
    width: '16%',
  },
  itemBody2: {
    width: '31%',
  },
  subTxt: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#000',
    fontSize: 12.68,
  },
});
