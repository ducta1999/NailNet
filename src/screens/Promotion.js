import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
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
import MultiSelect from './Components/MultiSelect';
import Loading from './Components/Loading';
import AnimatedSearchBox from './Components/AnimatedSearchBox';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import moment from 'moment';

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
    this.refSearchBox = React.createRef();
  }

  async componentDidMount() {
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

  async ensureDataFetched(
    searchText = this.state.searchText,
    selectedCity = this.state.selectedCity,
  ) {
    console.log(searchText, selectedCity);

    var categoriesFromAPI = await dataService.get(
      'api/promotioncategories/getall',
    );
    var categories = [];

    for (var index = categoriesFromAPI.items.length - 1; index >= 0; index--) {
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

  onpenDrawer() {
    this.props.navigation.openDrawer();
  }

  openSearchBox = () => this.refSearchBox.open();

  closeSearchBox = () => this.refSearchBox.close();

  render() {
    const {categories, loading} = this.state;
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
            <View style={{flex: 0.96}}>
              <AnimatedSearchBox
                ref={ref => (this.refSearchBox = ref)}
                placeholder={'Search by Title'}
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

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AddPromotion')}>
            <View style={{width: 68, height: 68}}>
              <LottieView
                source={require('../json/create.json')}
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
            {categories.map((item, i) => (
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
                  {this.renderListItem(item.promotions)}
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
    const {height} = Dimensions.get('window');

    return (
      <ScrollView style={{padding: 12}}>
        {items.map((item, i) => (
          <TouchableOpacity
            activeOpacity={0.79}
            key={i}
            style={{marginBottom: 18, marginTop: 9}}
            onPress={() =>
              this.props.navigation.navigate('PromotionDetail', {
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
                <View style={styles.itemBody2}>
                  <Text style={styles.subTitle}>Location</Text>
                  <Text style={styles.subTxt}>{item.location}</Text>
                </View>

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

                <View style={styles.itemBody1}>
                  <Text style={styles.subTitle}>Discount</Text>
                  <Text style={styles.subTxt}>{item.discount}%</Text>
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
