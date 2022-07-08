import React, {Component} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {
  View,
  Content,
  List,
  ListItem,
  Thumbnail,
  Container,
  Header,
  Text,
  Spinner,
  Tabs,
  Tab,
  TabHeading,
  ScrollableTab,
  Picker,
  Item,
  Body,
  Right,
} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from './../services/DataService';
import * as constant from './../services/Constant';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSelect from './Components/MultiSelect';
import Loading from './Components/Loading';
import LottieView from 'lottie-react-native';

export default class Classified extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategories: [],
      loading: true,
      // selectedCategory: [],
      listLoading: false,
      classifieds: [],
    };
  }

  async componentDidMount() {
    this.setState({loading: true});
    var mainCategoriesInDB = await dataService.get(
      'api/classifiedcategories/getallmain',
    );

    var mainCategories = [];
    for (var i = mainCategoriesInDB.items.length - 1; i >= 0; i--) {
      var subCategory = await dataService.get(
        'api/classifiedcategories/getall?parentid=' +
          mainCategoriesInDB.items[i].id,
      );

      var items = [
        {name: mainCategoriesInDB.items[i].description, id: 0, children: []},
      ];

      for (var j = 0; j < subCategory.items.length; j++) {
        items[0].children.push({
          name: subCategory.items[j].description,
          id: subCategory.items[j].id,
        });
      }

      var classifieds =
        items[0].children.length == 0
          ? []
          : await dataService.get(
              'api/classifieds/getall?isApproved=true&classifiedcategoryid=' +
                items[0].children[items[0].children.length - 1].id,
            );

      var selectedCategory =
        items[0].children.length == 0
          ? []
          : items[0].children[items[0].children.length - 1].id;

      mainCategories.push({
        mainCategory: mainCategoriesInDB.items[i],
        subCategories: items,
        classifieds: classifieds.items,
        selectedCategory: [selectedCategory],
      });
    }

    this.setState({mainCategories: mainCategories, loading: false});
    //this.ensureDataFetched();
  }

  async selectCategory(value, mainCategoryId) {
    try {
      var mainCategories = this.state.mainCategories;

      this.setState({listLoading: true});

      var classifieds =
        mainCategoryId == null
          ? {items: null}
          : await dataService.get(
              'api/classifieds/getall?isApproved=true&classifiedcategoryid=' +
                value[0],
            );
      for (var i = 0; i < mainCategories.length; i++) {
        if (mainCategories[i].mainCategory.id == mainCategoryId) {
          mainCategories[i].classifieds = classifieds.items;
          mainCategories[i].selectedCategory = value;
        }
      }

      this.setState({mainCategories: mainCategories});
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({listLoading: false});
    }
  }

  onpenDrawer() {
    this.props.navigation.openDrawer();
  }

  render() {
    const {loading, mainCategories, listLoading} = this.state;

    return (
      <Container style={styles.container}>
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
              onPress={() => this.props.navigation.navigate('AddClassified')}>
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

        <Content style={{marginTop: 12}}>
          {loading == false ? (
            <View>
              <Tabs
                tabBarUnderlineStyle={styles.tabUnderLine}
                renderTabBar={() => <ScrollableTab />}>
                {mainCategories &&
                  mainCategories.map((item, i) => (
                    <Tab
                      heading={
                        <TabHeading style={styles.tabHeading}>
                          <Text
                            style={{
                              color: 'black',
                            }}>
                            {item.mainCategory.description}
                          </Text>
                        </TabHeading>
                      }
                      style={styles.tabs}>
                      <View style={{flex: 1, backgroundColor: '#fff'}}>
                        <MultiSelect
                          items={item.subCategories}
                          placeHolder="Choose sub category..."
                          selectedItems={item.selectedCategory}
                          setSelectedItems={value =>
                            this.selectCategory(value, item.mainCategory.id)
                          }
                        />
                        {listLoading == true && <Loading />}
                        {item.classifieds && item.classifieds.length > 0 && (
                          <View>{this.renderListItem(item.classifieds)}</View>
                        )}
                      </View>
                    </Tab>
                  ))}
              </Tabs>
            </View>
          ) : (
            <Loading />
          )}
        </Content>
      </Container>
    );
  }

  renderListItem(items) {
    return (
      <View>
        <ScrollView>
          <List>
            {items.map((item, i) => (
              <ListItem
                avatar
                key={i}
                noBorder
                onPress={() =>
                  this.props.navigation.navigate('ClassifiedDetail', {
                    id: item.id,
                  })
                }>
                <Body>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.description} numberOfLines={4}>
                    {item.description}
                  </Text>
                  <Text style={styles.location}>Price: {item.price}</Text>
                  <Text style={styles.location}>Discount: {item.discount}</Text>
                  <Text style={styles.location}>Time: {item.createTime}</Text>
                  <Text style={styles.location}>Address: {item.address}</Text>
                </Body>
                <Right style={styles.right}>
                  {item.pictures && item.pictures.length > 0 ? (
                    <Thumbnail
                      square
                      large
                      source={{
                        uri:
                          constant.BASE_URL +
                          'api/classifiedimages/getimage/' +
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  listItemText: {
    color: 'white',
    fontSize: 20,
    flex: 1,
  },
  listItemThumbnail: {
    // flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 25,
    color: '#47BFB3',
    marginTop: 5,
    //marginRight: 80,
  },
  tabUnderLine: {
    backgroundColor: '#003566',
    height: 2.68,
  },
  tabHeading: {
    backgroundColor: '#fff',
    fontFamily: 'Montserrat-Medium',
    // borderBottomWidth: 1,
    // borderBottomColor: "white"
  },
  list: {
    //height: 600,
    backgroundColor: '#1F2426',
  },
  picker: {
    marginLeft: 40,
    //alignItems: "center",
    color: 'white',
  },
  caretIcon: {
    right: 25,
  },
  ///////////list//////////
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
  right: {
    justifyContent: 'center',
    marginTop: 15,
    marginLeft: 15,
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
  multiselect: {
    paddingLeft: 30,
    paddingRight: 30,
  },
});
