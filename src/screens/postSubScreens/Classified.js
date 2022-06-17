import React, {Component} from 'react';
import {StyleSheet, Alert, ScrollView, TouchableOpacity} from 'react-native';
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
import * as authentication from '../../services/Authentication';
import * as dataService from '../../services/DataService';
import * as constant from '../../services/Constant';
import * as toastService from '../../services/ToastService';

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
    var user = await authentication.getLoggedInUser();
    this.setState({loading: true});
    var mainCategoriesInDB = await dataService.get(
      'api/classifiedcategories/getall',
    );

    var classifieds = await dataService.get(
      `api/classifieds/getall?email=${user.email}&sortby=createtime`,
    );

    this.setState({
      mainCategories: mainCategoriesInDB,
      loading: false,
      classifieds: classifieds,
    });
  }

  render() {
    const {loading, mainCategories, classifieds} = this.state;

    return (
      <Container style={styles.container}>
        <Content>
          {loading == false ? (
            <View style={{flex: 1, backgroundColor: '#1F2426'}}>
              {this.renderListItem(classifieds.items)}
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
                  this.props.navigation.navigate('ClassifiedPostDetail', {
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
                  <Text style={{color: 'white', fontSize: 13}}>
                    Status:{' '}
                    {item.isApproved == true ? 'Approved' : 'Not Approved Yet'}
                  </Text>
                  <Button
                    backgroundColor="#D94526"
                    style={styles.replyButton}
                    onPress={() => this.remove(item)}>
                    <Text>Remove</Text>
                  </Button>
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

  async remove(item) {
    Alert.alert(
      'Delete Confirm',
      'Would you like to delete this item?',
      [
        {
          text: 'NO, thanks',
        },
        {
          text: 'OK',
          onPress: async () => {
            var result = await dataService.remove(
              `api/classifieds/delete/${item.id}`,
            );

            if (result.status == 200) {
              toastService.success('Delete job successfully!');
              this.ensureDataFetched();
            } else {
              toastService.error('Error: ' + result.data);
            }
          },
        },
      ],
      {cancelable: false},
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
