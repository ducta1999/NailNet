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
  Button,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from '../../services/DataService';
import * as constant from '../../services/Constant';
import * as toastService from '../../services/ToastService';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSelect from '../Components/MultiSelect';

import NumericInput from 'react-native-numeric-input';

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
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
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
              'api/classifieds/getall?isApproved=false&classifiedcategoryid=' +
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
  }

  async selectCategory(value, mainCategoryId) {
    var mainCategories = this.state.mainCategories;

    this.setState({listLoading: true});

    var classifieds =
      mainCategoryId == null
        ? {items: null}
        : await dataService.get(
            'api/classifieds/getall?isApproved=false&classifiedcategoryid=' +
              value[0],
          );

    for (var i = 0; i < mainCategories.length; i++) {
      if (mainCategories[i].mainCategory.id == mainCategoryId) {
        mainCategories[i].classifieds = classifieds.items;
        mainCategories[i].selectedCategory = value;
      }
    }

    this.setState({mainCategories: mainCategories, listLoading: false});
  }

  render() {
    const {loading, mainCategories, listLoading} = this.state;

    return (
      <Container style={styles.container}>
        <Content>
          {loading == false ? (
            <View>
              <Tabs
                transparent
                tabBarUnderlineStyle={styles.tabUnderLine}
                //renderTabBar={() => <ScrollableTab />}
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
                              backgroundColor="#0065ff"
                              items={item.subCategories}
                              placeHolder="Choose sub category"
                              selectedItems={item.selectedCategory}
                              setSelectedItems={value =>
                                this.selectCategory(value, item.mainCategory.id)
                              }
                            />
                            //   <SectionedMultiSelect
                            //    items={item.subCategories}
                            //    uniqueKey="id"
                            //   subKey="children"
                            //   expandDropDowns={true}
                            //  selectText="Choose sub category..."
                            //    showDropDowns={true}
                            //    readOnlyHeadings={true}
                            //   onSelectedItemsChange={value =>
                            //     this.selectCategory(value, item.mainCategory.id)
                            //    }
                            //     selectedItems={item.selectedCategory}
                            //    single={true}
                            //    selectToggleIconComponent={
                            //     <Icon
                            //      name="caret-down"
                            //      color="#D94526"
                            //      size={30}
                            //     style={styles.caretIcon}
                            //   />
                            //}
                            //  searchIconComponent={
                            //   <Icon
                            //    name="search"
                            //     color="#D94526"
                            //     size={15}
                            //     style={{marginLeft: 15}}
                            //   />
                            //  }
                            //  colors={color}
                            // styles={multiSelectStyles}
                            ///>
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

                        {item.classifieds && item.classifieds.length > 0 && (
                          <View>{this.renderListItem(item.classifieds)}</View>
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
                  this.props.navigation.navigate('ClassifiedConfigDetail', {
                    id: item.id,
                    onGoBack: () => this.ensureDataFetched(),
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
                    <Thumbnail large source={require('../../images/4.jpg')} />
                  )}
                </Right>
              </ListItem>
            ))}
          </List>
        </ScrollView>
      </View>
    );
  }

  async approve(item) {
    var data = {
      ...item,
      isApproved: true,
    };

    var result = await dataService.put(
      `api/classifieds/update/${data.id}`,
      data,
    );

    if (result.status == 200) {
      toastService.success('Approve classified successfully!');
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
  replyButton: {
    height: 30,
    marginTop: 10,
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
