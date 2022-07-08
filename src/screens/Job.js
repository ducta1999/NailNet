import React, {Component} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {
  View,
  Text,
  Content,
  List,
  ListItem,
  Body,
  Right,
  Thumbnail,
  Container,
  Header,
  Input,
  Spinner,
  Item,
  Tabs,
  Tab,
  TabHeading,
  ScrollableTab,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from '../services/DataService';
import * as authentication from '../services/Authentication';
import * as constant from '../services/Constant';
import LottieView from 'lottie-react-native';
import AnimatedSearchBox from './Components/AnimatedSearchBox';
import Loading from './Components/Loading';
import moment from 'moment';

export default class Job extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      selectedCategory: null,
      categories: [],
    };
    this.refSearchBox = React.createRef();
  }

  async componentDidMount() {
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    const {selectedCategory} = this.state;

    var categoriesFromAPI = await dataService.get('api/jobcategories/getall');
    var categories = [];

    for (var index = categoriesFromAPI.items.length - 1; index >= 0; index--) {
      var jobs = await dataService.get(
        `api/jobs/getall?isApproved=true&JobCategoryID=${categoriesFromAPI.items[index].id}`,
      );

      categories.push({
        category: categoriesFromAPI.items[index],
        jobs: jobs.items,
      });
    }

    this.setState({
      loading: false,
      categories: categories,
    });
  }

  onpenDrawer() {
    this.props.navigation.openDrawer();
  }
  render() {
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
            <TouchableOpacity onPress={() => this.onpenDrawer()}>
              <Image
                source={require('../icons/menu.png')}
                style={{width: 28, height: 28}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('AddJob')}>
              <View style={{width: 68, height: 68}}>
                <LottieView
                  source={require('../json/create.json')}
                  autoPlay
                  loop
                />
              </View>
            </TouchableOpacity>
          </View>
        </Header>

        {this.state.loading == false ? (
          <Tabs
            style={{marginTop: 12}}
            tabBarUnderlineStyle={styles.tabUnderLine}
            renderTabBar={() => <ScrollableTab />}>
            {this.state.categories.map((item, i) => (
              <Tab
                heading={
                  <TabHeading style={styles.tabHeading}>
                    <Text
                      style={{
                        color: 'black',
                      }}>
                      {item.category.description}
                    </Text>
                  </TabHeading>
                }
                style={styles.tabs}>
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                  {this.renderListItem(item.jobs)}
                </View>
              </Tab>
            ))}
          </Tabs>
        ) : (
          <Loading />
        )}
      </Content>
    );
  }

  renderListItem(items) {
    return (
      <ScrollView style={{padding: 12}}>
        {items &&
          items.map((item, i) => (
            <TouchableOpacity
              activeOpacity={0.79}
              key={i}
              style={{marginBottom: 18, marginTop: 9}}
              onPress={() =>
                this.props.navigation.navigate('JobDetail', {
                  id: item.id,
                })
              }>
              <View style={[styles.questionCard]}>
                <View style={[styles.row, styles.cardHeader]}>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.row}>
                    <Text style={styles.category}>
                      {
                        this.state.categories.find(
                          i => i.category.id == item.categoryID,
                        ).category.description
                      }
                    </Text>
                    <Icon
                      name="chevron-forward-outline"
                      size={18}
                      color="#979dac"
                    />
                  </View>
                </View>
                <View style={[styles.row, styles.cardBody]}>
                  <View style={[styles.itemBody2, {width: '68%'}]}>
                    <Text style={styles.subTitle}>Address</Text>
                    <Text style={styles.subTxt}>{item.address}</Text>
                  </View>

                  <View style={styles.itemBody2}>
                    <Text style={styles.subTitle}>Phone</Text>
                    <Text style={styles.subTxt}>{item.phone}</Text>
                  </View>
                </View>
                <View style={[styles.row, styles.cardBody]}>
                  <View style={styles.itemBody2}>
                    <Text style={styles.subTitle}>From</Text>
                    <Text style={styles.subTxt}>
                      {moment(item.fromDate, 'DD/MM/YYYY').format('ll')}
                    </Text>
                  </View>

                  <View style={styles.itemBody2}>
                    <Text style={styles.subTitle}>To</Text>
                    <Text style={styles.subTxt}>
                      {moment(item.toDate, 'DD/MM/YYYY').format('ll')}
                    </Text>
                  </View>

                  <View style={styles.itemBody2}>
                    <Text style={styles.subTitle}>Price</Text>
                    <Text style={styles.subTxt}>{item.price}$</Text>
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
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f6f6f7',
    borderRadius: 12,
    width: 222,
    paddingLeft: 18,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  caretIcon: {
    right: 25,
  },
  tabs: {
    backgroundColor: '#003566',
    borderWidth: 0,
  },
  picker: {
    marginLeft: 40,
    color: 'white',
  },
  tabHeading: {
    backgroundColor: '#fff',
    fontFamily: 'Montserrat-Medium',
    // borderBottomWidth: 1,
    // borderBottomColor: "white"
  },
  tabUnderLine: {
    backgroundColor: '#003566',
    height: 2.68,
  },
  name: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  titleLeft: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
  titleRight: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  avatar: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: 'white',
  },
  right: {
    marginTop: 25,

    paddingLeft: 0,
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
    borderRadius: 0,
  },
  major: {
    color: '#89aae6',
    fontSize: 11,
    fontFamily: 'Montserrat-SemiBoldItalic',
  },
  pd9: {
    paddingVertical: 4,
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
    alignItems: 'stretch',
  },
  itemBody1: {
    width: '15%',
  },
  itemBody2: {
    width: '28%',
  },
  subTxt: {
    fontFamily: 'Montserrat-SemiBold',
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
  question: {
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    fontSize: 12.68,
  },
});
