import React, {Component} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
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

export default class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategories: [],
      loading: true,
      // selectedCategory: [],
      listLoading: false,
      products: [],
    };
  }

  async componentDidMount() {
    this.setState({loading: true});
    var mainCategoriesInDB = await dataService.get(
      'api/productcategories/getallmain',
    );

    var mainCategories = [];
    for (var i = mainCategoriesInDB.items.length - 1; i >= 0; i--) {
      var subCategory = await dataService.get(
        'api/productcategories/getall?parentid=' +
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

      var products =
        items[0].children.length == 0
          ? []
          : await dataService.get(
              'api/products/getall?isApproved=true&productcategoryid=' +
                items[0].children[items[0].children.length - 1].id,
            );

      var selectedCategory =
        items[0].children.length == 0
          ? []
          : items[0].children[items[0].children.length - 1].id;

      mainCategories.push({
        mainCategory: mainCategoriesInDB.items[i],
        subCategories: items,
        products: products.items,
        selectedCategory: [selectedCategory],
      });
    }

    this.setState({mainCategories: mainCategories, loading: false});
    //this.ensureDataFetched();
  }

  async selectCategory(value, mainCategoryId) {
    var mainCategories = this.state.mainCategories;

    this.setState({listLoading: true});

    var products =
      mainCategoryId == null
        ? {items: null}
        : await dataService.get(
            'api/products/getall?isApproved=true&productcategoryid=' + value[0],
          );

    for (var i = 0; i < mainCategories.length; i++) {
      if (mainCategories[i].mainCategory.id == mainCategoryId) {
        mainCategories[i].products = products.items;
        mainCategories[i].selectedCategory = value;
      }
    }

    this.setState({mainCategories: mainCategories, listLoading: false});
  }

  render() {
    const {loading, mainCategories, listLoading} = this.state;

    return (
      <Container style={styles.container}>
        <Header transparent>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({loading: true});
                  this.props.navigation.goBack();
                }}>
                <Icon name="arrow-back-outline" color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.title}>Shop</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('AddProduct')}>
                <Thumbnail
                  source={require('../icons/edit.png')}
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Header>

        <Content>
          {loading == false ? (
            <View>
              <Tabs
                transparent
                tabBarUnderlineStyle={styles.tabUnderLine}
                ////renderTabBar={() => <ScrollableTab />}
              >
                {mainCategories &&
                  mainCategories.map((item, i) => (
                    <Tab
                      heading={
                        <TabHeading style={styles.tabHeading}>
                          <Text>{item.mainCategory.description}</Text>
                        </TabHeading>
                      }>
                      <View style={{flex: 1, backgroundColor: '#1F2426'}}>
                        {/* {this.renderListItem(item.promotions)} */}

                        <View style={styles.multiselect}>
                          {loading == false && (
                            <MultiSelect
                              items={item.subCategories}
                              placeHolder="Choose sub category..."
                              selectedItems={item.selectedCategory}
                              setSelectedItems={value =>
                                this.selectCategory(value, item.mainCategory.id)
                              }
                            />

                            // <Picker
                            //   mode="dropdown"
                            //   placeholder="GUEST"
                            //   iosIcon={<Icon name="arrow-down" />}
                            //   style={styles.picker}
                            //   selectedValue={selectedCategory}
                            //   onValueChange={value =>
                            //     this.selectCategory(value, item.mainCategory.id)
                            //   }
                            // >
                            //   <Picker.Item
                            //     label={"Choose your category"}
                            //     value={null}
                            //   />
                            //   {item.subCategories &&
                            //     item.subCategories.map((category, index) => (
                            //       <Picker.Item
                            //         label={category.description}
                            //         value={category.id}
                            //         key={index}
                            //       />
                            //     ))}
                            // </Picker>
                          )}
                          {/* <Icon
                            name="caret-down"
                            color="#FFFFFF"
                            size={30}
                            style={styles.caretIcon}
                          /> */}
                        </View>

                        {listLoading == true && (
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

                        {item.products && item.products.length > 0 && (
                          <View>{this.renderListItem(item.products)}</View>
                        )}
                      </View>
                    </Tab>
                  ))}
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
        <ScrollView>
          <List>
            {items.map((item, i) => (
              <ListItem
                avatar
                key={i}
                noBorder
                onPress={() =>
                  this.props.navigation.navigate('ProductDetail', {
                    id: item.id,
                  })
                }>
                <Body>
                  <Text style={styles.name}>{item.productName}</Text>
                  <Text
                    style={styles.description}
                    numberOfLines={3}
                    ellipsizeMode="tail">
                    {item.description}
                  </Text>

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
                          'api/productimages/getimage/' +
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
    backgroundColor: '#1F2426',
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
    display: 'none',
    backgroundColor: '#1F2426',
  },
  tabHeading: {
    backgroundColor: '#1F2426',
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

//multiselect style
const multiSelectStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  selectToggleText: {color: '#D94526'},
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
