import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
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
  Header,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import * as dataService from '../../services/DataService';
import * as authentication from '../../services/Authentication';
import LinearGradient from 'react-native-linear-gradient';
import MultiSelect from '../Components/MultiSelect';
import LottieView from 'lottie-react-native';
import AnimatedSearchBox from '../Components/AnimatedSearchBox';

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
    this.refSearchBox = React.createRef();

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
    try {
      var industriesFromAPI = await dataService.get('api/faqindustries/getall');

      var industries = [];

      for (
        var index = industriesFromAPI.items.length - 1;
        index >= 0;
        index--
      ) {
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
    } catch (error) {
      console.log(error);
    }
  }

  applyFilterByCity(value) {
    this.setState({selectedCity: value, loading: true});
    this.ensureDataFetched(this.state.searchText, value[0]);
  }

  onpenDrawer() {
    this.props.navigation.openDrawer();
  }

  openAddQuestionPage() {
    this.props.navigation.navigate('AddQuestionPublic');
  }

  openSearchBox = () => this.refSearchBox.open();

  closeSearchBox = () => this.refSearchBox.close();
  render() {
    const {industries, loading} = this.state;
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
                source={require('../../icons/menu.png')}
                style={{width: 28, height: 28}}
              />
            </TouchableOpacity>
            <View style={{flex: 0.96}}>
              <AnimatedSearchBox
                ref={ref => (this.refSearchBox = ref)}
                placeholder={'Search by Name'}
                placeholderTextColor="#848484"
                backgroundColor="#f6f6f7"
                searchIconColor="#000"
                focusAfterOpened
                searchIconSize={18}
                borderRadius={12}
                onChangeText={text => {
                  this.setState({searchText: text});
                  this.ensureDataFetched(text, this.state.selectedCity);
                }}
                onBlur={() => this.closeSearchBox()}
              />
            </View>
          </View>
        </Header>
        <View
          style={{
            paddingHorizontal: 12,
            marginBottom: 9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{width: '84%'}}>
            {this.state.cities && (
              <MultiSelect
                items={this.state.cities}
                placeHolder="Choose City..."
                selectedItems={this.state.selectedCity}
                setSelectedItems={value => {
                  this.setState({selectedCity: value});
                  this.ensureDataFetched(this.state.searchText, value);
                }}
              />
            )}
          </View>

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

        {loading == false ? (
          <Tabs
            tabBarUnderlineStyle={styles.tabUnderLine}
            renderTabBar={() => <ScrollableTab />}>
            {industries.map((item, i) => (
              <Tab
                heading={
                  <TabHeading style={styles.tabHeading}>
                    <Text
                      style={{
                        color: 'black',
                      }}>
                      {item.industry.description}
                    </Text>
                  </TabHeading>
                }
                style={styles.tabs}>
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                  {this.renderListItem(
                    item.profiles,
                    item.industry.description,
                    item.industry.id,
                  )}
                </View>
              </Tab>
            ))}
          </Tabs>
        ) : (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
            }}>
            <View style={{height: 168}}>
              <LottieView
                source={require('../../json/loading.json')}
                autoPlay
                loop
              />
            </View>
          </View>
        )}
      </Content>
    );
  }

  renderListItem(list, description, id) {
    const {height} = Dimensions.get('window');

    return (
      <ScrollView style={{minHeight: height}}>
        {list.map((item, i) => (
          <TouchableOpacity
            activeOpacity={0.79}
            onPress={() => this.openPrivateQuestion(item.id, description, id)}>
            <View
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                margin: 9,
              }}>
              <LinearGradient
                start={{x: 0.0, y: 0.25}}
                end={{x: 0.5, y: 1.0}}
                colors={['#0a1128', '#12437c', '#0a1128']}
                style={{
                  padding: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={
                        styles.name
                      }>{`${item.firstName} ${item.lastName}`}</Text>
                    <Text style={styles.major}>{description}</Text>
                  </View>

                  <Thumbnail
                    large
                    source={require('../../icons/Avatar.png')}
                    defaultSource={{uri: 'avatar'}}
                    // source={{
                    //   uri:
                    //     constant.BASE_URL +
                    //     'api/avatars/getimage/' +
                    //     item.email +
                    //     '?random_number=' +
                    //     new Date().getTime(),
                    // }}
                    style={styles.avatar}
                  />
                </View>
                <View style={{padding: 12}}>
                  <Text style={styles.pd9}>
                    <Text style={styles.titleLeft}>Company: </Text>
                    <Text style={styles.titleRight}>
                      {' '}
                      {item.businessAddress}
                    </Text>
                  </Text>

                  <Text style={styles.pd9}>
                    <Text style={styles.titleLeft}>Email: {'         '}</Text>
                    <Text style={styles.titleRight}>{item.email}</Text>
                  </Text>

                  <Text style={styles.pd9}>
                    <Text style={styles.titleLeft}>Phone: {'      '}</Text>
                    <Text style={styles.titleRight}> {item.phone}</Text>
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
});
