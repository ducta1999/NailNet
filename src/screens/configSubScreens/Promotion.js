import React, {Component} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
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
  Button,
  ScrollableTab,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from '../../services/DataService';
import * as authentication from '../../services/Authentication';
import * as toastService from '../../services/ToastService';
import * as constant from '../../services/Constant';
import * as formatDate from '../../services/FormatDate';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import NumericInput from 'react-native-numeric-input';

export default class Promotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      cities: [],
      selectedCity: [],
      selectedCategory: null,
      categories: [],
      searchText: null,
    };

    this.approve = this.approve.bind(this);
  }

  async componentDidMount() {
    var user = await authentication.getLoggedInUser();

    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    var categoriesFromAPI = await dataService.get(
      'api/promotioncategories/getall',
    );
    var categories = [];

    for (var index = categoriesFromAPI.items.length - 1; index >= 0; index--) {
      var promotions = await dataService.get(
        `api/promotions/getall?promotioncategoryID=${categoriesFromAPI.items[index].id}&isapproved=false`,
      );
      console.log(promotions);
      console.log(categoriesFromAPI.items[index].id);
      categories.push({
        category: categoriesFromAPI.items[index],
        promotions: promotions.items,
      });
    }

    this.setState({
      loading: false,
      // items: promotions.items,
      // cities: cities,
      categories: categories,
    });
  }

  applyFilterBycategory(value) {
    this.setState({selectedCategory: value, loading: true}, () => {
      this.ensureDataFetched();
    });
  }

  render() {
    return (
      <Content>
        {this.state.loading == false ? (
          <Tabs
            transparent
            tabBarUnderlineStyle={styles.tabUnderLine}
            //renderTabBar={() => <ScrollableTab />}
          >
            {this.state.categories.map((item, i) => (
              <Tab
                heading={
                  <TabHeading style={styles.tabHeading}>
                    <Text>{item.category.description}</Text>
                  </TabHeading>
                }
                style={styles.tabs}>
                <View style={{flex: 1, backgroundColor: '#1F2426'}}>
                  {this.renderListItem(item.promotions)}
                </View>
              </Tab>
            ))}
            {/* <Tab
              heading={
                <TabHeading style={styles.tabHeading}>
                  <Text>DOCTOR</Text>
                </TabHeading>
              }
              style={styles.tabs}
            >
              {this.renderListItem(this.state.list)}
            </Tab> */}
          </Tabs>
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
    );
  }

  renderListItem(items) {
    return (
      <View>
        {items && items.length != 0 ? (
          <ScrollView>
            <List style={styles.list}>
              {items.map((item, i) => (
                <ListItem
                  avatar
                  key={i}
                  onPress={() =>
                    this.props.navigation.navigate('PromotionConfigDetail', {
                      id: item.id,
                      onGoBack: () => this.ensureDataFetched(),
                    })
                  }>
                  <Body>
                    <Text style={styles.name}>{item.title}</Text>
                    <Text
                      style={styles.description}
                      numberOfLines={3}
                      ellipsizeMode="tail">
                      {item.description}
                    </Text>
                    <Text style={styles.location}>
                      Location: {item.location}
                    </Text>
                    <Text style={styles.discount}>
                      Discount: {item.discount}%
                    </Text>
                    <Text style={styles.location}>
                      category:{' '}
                      {
                        this.state.categories.find(
                          i => i.category.id == item.categoryID,
                        ).category.description
                      }
                    </Text>
                    <Text style={styles.location}>From: {item.fromDate}</Text>
                    <Text style={styles.location}>To: {item.toDate}</Text>
                    <Text style={styles.location}>Phone: {item.phone}</Text>
                    <Button
                      backgroundColor="#47BFB3"
                      style={styles.replyButton}
                      onPress={() => this.approve(item)}>
                      <Text>Approve</Text>
                    </Button>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                      <Text style={{color: 'white', padding: 3}}>Priority</Text>
                      <NumericInput
                        value={item.priority}
                        type="up-down"
                        totalWidth={80}
                        totalHeight={30}
                        textColor="white"
                        rightButtonBackgroundColor="#47BFB3"
                        iconSize={35}
                        onChange={value => (item.priority = value)}
                      />
                    </View>

                    {/* <View style={styles.footerGroup}>
                    <View style={styles.footerGroupView}>
                      <Text style={styles.footerGroupText}>
                        Post date: {item.postDate}
                      </Text>
                    </View>

                    <View style={styles.footerGroupView}>
                      <Text style={styles.footerGroupText}>
                        View: {item.view}
                      </Text>
                    </View>

                    <View style={styles.footerGroupView}>
                      <Text style={styles.footerGroupText}>
                        Answer: {item.answer}
                      </Text>
                    </View>
                  </View> */}
                  </Body>
                  <Right style={styles.right}>
                    {/* <Thumbnail large source={require("../images/2.jpeg")} /> */}
                    {item.pictures && item.pictures.length > 0 ? (
                      <Thumbnail
                        large
                        source={{
                          uri:
                            constant.BASE_URL +
                            'api/promotionpictures/getimage/' +
                            item.pictures[0].id,
                        }}
                      />
                    ) : (
                      <Thumbnail large source={require('../../images/4.jpg')} />
                    )}
                  </Right>
                </ListItem>
              ))}
            </List>
          </ScrollView>
        ) : (
          <View style={{height: 400}} />
        )}
      </View>
    );
  }

  async approve(item) {
    var data = {
      ...item,
      isApproved: true,
      toDate: formatDate.formatDateStringToSendAPI(item.toDate),
      fromDate: formatDate.formatDateStringToSendAPI(item.fromDate),
      pictures: null,
      profile: null,
    };

    var result = await dataService.put(
      `api/promotions/update/${data.id}`,
      data,
    );

    if (result.status == 200) {
      toastService.success('Approve promotion successfully!');
      this.ensureDataFetched();
    } else {
      toastService.error('Error: ' + result.data);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  list: {
    //height: 400,
    backgroundColor: '#1F2426',
  },
  name: {
    color: '#D94526',
    fontWeight: 'bold',
  },
  description: {
    color: 'white',
  },
  location: {
    color: '#47BFB3',
    fontSize: 15,
  },
  picker: {
    marginLeft: 40,
    //alignItems: "center",
    color: 'white',
  },
  caretIcon: {
    right: 25,
  },
  discount: {
    color: '#D94526',
    fontSize: 15,
  },
  //   footerGroupText: {
  //     color: "#47BFB3",
  //     fontSize: 12
  //   },
  footerGroup: {
    flex: 1,
    flexDirection: 'row',
  },
  footerGroupView: {
    marginRight: 20,
  },
  right: {
    justifyContent: 'center',
    marginTop: 15,
    // marginLeft: 15
  },
  replyButton: {
    height: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 15,
    color: '#47BFB3',
    //marginRight: 80,
    marginTop: 10,
  },

  input: {
    // alignItems: "center"
    color: 'white',
    marginTop: -15,
    marginLeft: -50,
    marginRight: -20,
  },
  tabHeading: {
    backgroundColor: '#1F2426',
    // borderBottomWidth: 1,
    // borderBottomColor: "white"
  },
  tabUnderLine: {
    display: 'none',
    backgroundColor: '#1F2426',
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});

//multiselect style
const multiSelectStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  selectToggleText: {color: 'white'},
  button: {backgroundColor: '#D94526'},
  searchBar: {backgroundColor: '#1F2426'},
  searchTextInput: {color: '#D94526'},
});
const color = {
  text: '#D94526',
  subText: '#47BFB3',
  searchPlaceholderTextColor: '#D94526',
  itemBackground: '#1F2426',
  subItemBackground: '#1F2426',
};
