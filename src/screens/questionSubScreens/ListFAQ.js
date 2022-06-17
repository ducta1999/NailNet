import React, {Component} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {
  View,
  Text,
  Content,
  List,
  Input,
  Item,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Button,
  Tab,
  Tabs,
  ScrollableTab,
  Spinner,
  TabHeading,
  Picker,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from '../../services/DataService';
import * as authentication from '../../services/Authentication';
import * as constant from '../../services/Constant';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

export default class ListFAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industries: [],
      loading: true,
      selectedCity: [],
      cities: [],
      searchText: null,
    };

    this.openPrivateQuestion = this.openPrivateQuestion.bind(this);
  }

  async componentDidMount() {
    // this.props.onChangeTab(0);
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

    this.setState({
      cities: itemCities,
    });

    var user = await authentication.getLoggedInUser();

    if (user.cityConfirm == true) {
      // this.setState({
      //   selectedCity: this.state.selectedCity.concat([
      //     itemCities[0].children.find(o => o.name == user.city).id
      //   ])
      // });
      // this.ensureDataFetched(null, user.city);
      this.setState({
        selectedCity: this.state.selectedCity.concat([
          itemCities[0].children.find(o => o.name == 'No Choose').id,
        ]),
      });
      this.ensureDataFetched(null, null);
    } else {
      this.ensureDataFetched(null, null);
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({loading: true});

    if (newProps.searchText.trim() == '') {
      this.setState({searchText: null});
      this.ensureDataFetched(null, this.state.selectedCity);
    } else {
      this.setState({searchText: newProps.searchText});
      this.ensureDataFetched(newProps.searchText, this.state.selectedCity);
    }
  }

  async ensureDataFetched(searchText, city) {
    var industriesFromAPI = await dataService.get('api/faqindustries/getall');

    var industries = [];

    for (var index = industriesFromAPI.items.length - 1; index >= 0; index--) {
      var profiles = [];
      if (searchText == null) {
        if (city == null) {
          profiles = await dataService.get(
            'api/profiles/getall?isApproved=true&ispro=true&industryid=' +
              industriesFromAPI.items[index].id,
          );
        } else {
          profiles = await dataService.get(
            'api/profiles/getall?isApproved=true&ispro=true&industryid=' +
              industriesFromAPI.items[index].id +
              '&city=' +
              city,
          );
        }
      } else {
        if (city == null) {
          profiles = await dataService.get(
            'api/profiles/getall?isApproved=true&ispro=true&industryid=' +
              industriesFromAPI.items[index].id +
              '&name=' +
              searchText,
          );
        } else {
          profiles = await dataService.get(
            'api/profiles/getall?isApproved=true&ispro=true&industryid=' +
              industriesFromAPI.items[index].id +
              '&name=' +
              searchText +
              '&city=' +
              city,
          );
        }
      }

      industries.push({
        industry: industriesFromAPI.items[index],
        profiles: profiles.items,
      });
    }

    this.setState({industries: industries, loading: false});
  }

  applyFilterByCity(value) {
    this.setState({selectedCity: value, loading: true});
    this.ensureDataFetched(this.state.searchText, value[0]);
  }

  render() {
    const {industries, loading} = this.state;

    return (
      <Content>
        <View style={{marginLeft: 20}}>
          <View>
            <Thumbnail
              small
              source={require('../../icons/signupicon_city.png')}
            />
          </View>
          <View
            style={{
              marginLeft: 55,
              justifyContent: 'center',
              marginTop: -50,
            }}>
            {this.state.cities && (
              <SectionedMultiSelect
                items={this.state.cities}
                uniqueKey="id"
                subKey="children"
                expandDropDowns={true}
                selectText="Choose City..."
                showDropDowns={true}
                readOnlyHeadings={true}
                onSelectedItemsChange={value =>
                  // this.setState({ selectedCity: value })
                  this.applyFilterByCity(value)
                }
                selectedItems={this.state.selectedCity}
                single={true}
                selectToggleIconComponent={
                  <Icon
                    name="caret-down"
                    color="#D94526"
                    size={30}
                    style={styles.caretIcon}
                  />
                }
                searchIconComponent={
                  <Icon
                    name="search"
                    color="#D94526"
                    size={15}
                    style={{marginLeft: 15}}
                  />
                }
                colors={color}
                styles={multiSelectStyles}
              />
            )}
          </View>
        </View>
        {/* <Item>
          <Thumbnail
            small
            source={require("../../icons/signupicon_city.png")}
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
              <Picker.Item label={"Please choose your city"} value={null} />
              {this.state.cities.map((city, i) => (
                <Picker.Item label={city.name} value={city.name} key={i} />
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

        {loading == false ? (
          <Tabs
            transparent
            tabBarUnderlineStyle={styles.tabUnderLine}
            renderTabBar={() => <ScrollableTab />}>
            {industries.map((item, i) => (
              <Tab
                heading={
                  <TabHeading style={styles.tabHeading}>
                    <Text>{item.industry.description}</Text>
                  </TabHeading>
                }
                style={styles.tabs}>
                <View style={{flex: 1, backgroundColor: '#1F2426'}}>
                  {this.renderListItem(
                    item.profiles,
                    item.industry.description,
                    item.industry.id,
                  )}
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

  renderListItem(list, description, id) {
    return (
      <ScrollView>
        <List>
          {list.map((item, i) => (
            <ListItem
              onPress={() => this.openPrivateQuestion(item.id, description, id)}
              avatar
              key={i}
              noBorder>
              <Left>
                <Thumbnail
                  large
                  //source={require("../../icons/Avatar.png")}
                  defaultSource={{uri: 'avatar'}}
                  source={{
                    uri:
                      constant.BASE_URL +
                      'api/avatars/getimage/' +
                      item.email +
                      '?random_number=' +
                      new Date().getTime(),
                  }}
                  style={styles.avatar}
                />
              </Left>
              <Body style={styles.body}>
                <Text style={styles.name}>
                  {item.firstName} {item.lastName}
                </Text>
                <Text>
                  <Text style={styles.company}>Company: </Text>
                  <Text style={styles.companyText}>
                    {' '}
                    {item.businessAddress}
                  </Text>
                </Text>

                <Text>
                  <Text style={styles.email}>Email: {'        '}</Text>
                  <Text style={styles.emailText}>{item.email}</Text>
                </Text>

                <Text>
                  <Text style={styles.phone}>Phone: {'      '}</Text>
                  <Text style={styles.phoneText}> {item.phone}</Text>
                </Text>
              </Body>
              <Right>
                <View style={styles.right}>
                  <Thumbnail
                    small
                    source={require('../../icons/right_arrow.png')}
                  />
                </View>
              </Right>
            </ListItem>
          ))}
        </List>
      </ScrollView>
    );
  }

  openPrivateQuestion(id, description, industryID) {
    //console.log(description);
    this.props.navigation.navigate('DoctorDetail', {
      id: id,
      description: description,
      industryID: industryID,
    });
  }
}

const styles = StyleSheet.create({
  input: {
    marginTop: -30,
    alignItems: 'center',
    padding: 25,
  },
  caretIcon: {
    right: 25,
  },
  tabs: {
    backgroundColor: '#1F2426',
    borderWidth: 0,
  },
  picker: {
    marginLeft: 40,
    //alignItems: "center",
    color: 'white',
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
  name: {
    color: '#D94526',
    fontWeight: 'bold',
    fontSize: 16,
  },
  company: {
    color: 'white',
    fontSize: 12,
  },
  email: {
    color: 'white',
    fontSize: 12,
  },
  phone: {
    color: 'white',
    fontSize: 12,
  },
  companyText: {
    color: 'white',
    fontSize: 12,
  },
  emailText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 15,
  },
  phoneText: {
    color: 'white',
    fontSize: 12,
  },
  avatar: {
    left: 0,
    marginTop: 20,
  },
  right: {
    marginTop: 25,

    paddingLeft: 0,
  },
  body: {},
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
