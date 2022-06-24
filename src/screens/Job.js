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
  ScrollableTab,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from '../services/DataService';
import * as authentication from '../services/Authentication';
import * as constant from '../services/Constant';

export default class Job extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      selectedCategory: null,
      categories: [],
    };
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
              <Text style={styles.title}>Job</Text>
            </View>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('AddJob')}>
                  <Thumbnail
                    source={require('../icons/edit.png')}
                    style={styles.thumbnail}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Header>

        <Content>
          {this.state.loading == false ? (
            <View>
              <Tabs
                transparent
                tabBarUnderlineStyle={styles.tabUnderLine}
                renderTabBar={() => <ScrollableTab />}>
                {this.state.categories.map((item, i) => (
                  <Tab
                    heading={
                      <TabHeading style={styles.tabHeading}>
                        <Text>{item.category.description}</Text>
                      </TabHeading>
                    }
                    style={styles.tabs}>
                    <View style={{flex: 1, backgroundColor: '#1F2426'}}>
                      {this.renderListItem(item.jobs)}
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
            </View>
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
                    this.props.navigation.navigate('JobDetail', {
                      id: item.id,
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
                    <Text style={styles.location}>Address: {item.address}</Text>
                    <Text style={styles.discount}>Price: {item.price}/h</Text>
                    <Text style={styles.location}>
                      Category:{' '}
                      {
                        this.state.categories.find(
                          i => i.category.id == item.categoryID,
                        ).category.description
                      }
                    </Text>
                    <Text style={styles.location}>From: {item.fromDate}</Text>
                    <Text style={styles.location}>To: {item.toDate}</Text>
                    <Text style={styles.location}>Phone: {item.phone}</Text>
                  </Body>
                  <Right style={styles.right}>
                    {/* <Thumbnail large source={require("../images/2.jpeg")} /> */}
                    {item.pictures && item.pictures.length > 0 ? (
                      <Thumbnail
                        large
                        source={{
                          uri:
                            constant.BASE_URL +
                            'api/jobimages/getimage/' +
                            item.pictures[0].id,
                        }}
                      />
                    ) : (
                      <Thumbnail large source={require('../images/4.jpg')} />
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
