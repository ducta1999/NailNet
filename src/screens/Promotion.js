import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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
// import {TouchableOpacity} from 'react-native-gesture-handler';
import * as dataService from '../services/DataService';
import * as authentication from '../services/Authentication';
import * as constant from '../services/Constant';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSelect from './Components/MultiSelect';
let ScreenHeight = Dimensions.get('window').height;
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
  }

  async componentDidMount() {
    var promotions = await dataService.get('api/promotions/getall');
    // var cities = await dataService.getOnlineData(
    //   "https://thongtindoanhnghiep.co/api/city"
    // );
    var cities = await dataService.getProvince();
    var itemCities = [{name: 'City', id: 0, children: []}];
    itemCities[0].children.push({
      name: 'No Choose',
      id: null,
    });

    for (var j = 0; j < cities.length; j++) {
      itemCities[0].children.push({
        name: cities[j].name,
        id: cities[j].name,
      });
    }

    var user = await authentication.getLoggedInUser();
    if (user.cityConfirm == true) {
      // this.setState({
      //   cities: itemCities,
      //   selectedCity: this.state.selectedCity.concat([
      //     itemCities[0].children.find(o => o.name == user.city).id
      //   ])
      // });
      this.setState({
        cities: itemCities,
        selectedCity: this.state.selectedCity.concat([
          itemCities[0].children.find(o => o.name == 'No Choose').id,
        ]),
      });
    } else {
      this.setState({
        cities: itemCities,
      });
    }

    this.ensureDataFetched();
    // this.setState({
    //   loading: false,
    //   items: promotions.items,
    //   cities: cities,
    //   categories: categories
    // });
  }

  async ensureDataFetched() {
    const {searchText, selectedCategory, selectedCity} = this.state;

    var categoriesFromAPI = await dataService.get(
      'api/promotioncategories/getall',
    );
    var categories = [];

    for (var index = categoriesFromAPI.items.length - 1; index >= 0; index--) {
      var promotion = [];
      if (searchText != null) {
        if (selectedCity[0] != null) {
          console.log(selectedCity[0]);
          promotions = await dataService.get(
            `api/promotions/getall?isApproved=true&title=${searchText}&city=${selectedCity[0]}&promotioncategoryID=${categoriesFromAPI.items[index].id}`,
          );
        } else {
          promotions = await dataService.get(
            `api/promotions/getall?isApproved=true&title=${searchText}&promotioncategoryID=${categoriesFromAPI.items[index].id}`,
          );
        }
      } else {
        if (selectedCity[0] != null) {
          console.log(selectedCity[0]);
          promotions = await dataService.get(
            `api/promotions/getall?isApproved=true&city=${selectedCity[0]}&promotioncategoryID=${categoriesFromAPI.items[index].id}`,
          );
        } else {
          promotions = await dataService.get(
            `api/promotions/getall?isApproved=true&promotioncategoryID=${categoriesFromAPI.items[index].id}`,
          );
        }
      }

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

  searchByTitle(title) {
    this.setState({searchText: title, loading: true}, () => {
      this.ensureDataFetched();
    });
  }

  applyFilterByCity(value) {
    this.setState({selectedCity: value, loading: true}, () => {
      this.ensureDataFetched();
    });
    //this.ensureDataFetched(this.state.searchText, value);
  }

  applyFilterBycategory(value) {
    this.setState({selectedCategory: value, loading: true}, () => {
      this.ensureDataFetched();
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
              <Input
                placeholder="Enter title to search"
                placeholderTextColor="#848484"
                style={styles.input}
                onSubmitEditing={event =>
                  this.searchByTitle(event.nativeEvent.text)
                }
              />
            </View>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('AddPromotion')
                  }>
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
              <View style={{marginLeft: 20}}>
                <View>
                  <Thumbnail
                    small
                    source={require('../icons/signupicon_city.png')}
                  />
                </View>
                <View
                  style={{
                    marginLeft: 55,
                    justifyContent: 'center',
                    marginTop: -50,
                    marginBottom: -25,
                  }}>
                  {this.state.cities && (
                    <MultiSelect
                      items={this.state.cities}
                      placeHolder="Choose City..."
                      selectedItems={this.state.selectedCity}
                      setSelectedItems={value => this.applyFilterByCity(value)}
                    />
                  )}
                </View>
              </View>
              {/* <Item>
                <Thumbnail
                  small
                  style={{ marginLeft: 20 }}
                  source={require("../icons/signupicon_city.png")}
                />

                {this.state.loading == false && this.state.cities && (
                  <Picker
                    mode="dropdown"
                    placeholder="GUEST"
                    iosIcon={<Icon name="arrow-down" />}
                    style={styles.picker}
                    selectedValue={this.state.selectedCity}
                    onValueChange={value => this.applyFilterByCity(value)}
                  >
                    <Picker.Item
                      label={"Please choose your city"}
                      value={null}
                    />
                    {this.state.cities.map((city, i) => (
                      <Picker.Item
                        label={city.name}
                        value={city.name}
                        key={i}
                      />
                    ))}
                  </Picker>
                )}
                <Icon
                  name="caret-down"
                  color="#FFFFFF"
                  size={30}
                  style={styles.caretIcon}
                />
              </Item> */}

              {/* <Item>
                <Thumbnail
                  style={{ marginLeft: 20 }}
                  small
                  source={require("../icons/signupicon_nail.png")}
                />

                {this.state.loading == false && this.state.cities && (
                  <Picker
                    mode="dropdown"
                    placeholder="GUEST"
                    iosIcon={<Icon name="arrow-down" />}
                    style={styles.picker}
                    selectedValue={this.state.selectedCategory}
                    onValueChange={value => this.applyFilterBycategory(value)}
                  >
                    <Picker.Item
                      label={"Please choose your category"}
                      value={null}
                    />
                    {this.state.categories.items.map((category, i) => (
                      <Picker.Item
                        label={category.description}
                        value={category.id}
                        key={i}
                      />
                    ))}
                  </Picker>
                )}
                <Icon
                  name="caret-down"
                  color="#FFFFFF"
                  size={30}
                  style={styles.caretIcon}
                />
              </Item> */}

              <Tabs
                transparent
                tabBarUnderlineStyle={styles.tabUnderLine}
                // //renderTabBar={() => <ScrollableTab />}
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
      <View style={styles.scrollview}>
        {items && items.length != 0 ? (
          <ScrollView>
            <List style={styles.list}>
              {items.map((item, i) => (
                <ListItem
                  avatar
                  key={i}
                  onPress={() =>
                    this.props.navigation.navigate('PromotionDetail', {
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
    //height: ScreenHeight,
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
