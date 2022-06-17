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
import * as dataService from '../../services/DataService';
import * as toastService from '../../services/ToastService';
import * as constant from '../../services/Constant';
import * as authentication from '../../services/Authentication';

export default class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.ensureDataFetched();
  }

  async componentDidMount() {
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    var mainCategories = await dataService.get('api/productcategories/getall');

    this.setState({
      categories: mainCategories,
      loading: false,
    });
  }

  render() {
    const {loading, categories} = this.state;

    return (
      <Container style={styles.container}>
        <Content>
          {loading == false ? (
            <View style={{flex: 1, backgroundColor: '#1F2426'}}>
              {this.renderListItem(categories.items)}
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
                // onPress={() =>
                //   this.props.navigation.navigate("ShopPostDetail", {
                //     id: item.id,
                //     onGoBack: () => this.ensureDataFetched()
                //   })
                // }
              >
                <Body>
                  <Text style={styles.name}>{item.description}</Text>
                  {item.parentID == null ? (
                    <Text style={styles.location}>Main Category</Text>
                  ) : (
                    <Text style={styles.location}>Sub Category</Text>
                  )}
                  {item.parentID != null &&
                    this.state.categories.items.find(
                      i => i.id == item.parentID,
                    ) != null && (
                      <Text style={styles.location}>
                        Belong to{' '}
                        {
                          this.state.categories.items.find(
                            i => i.id == item.parentID,
                          ).description
                        }{' '}
                        category
                      </Text>
                    )}
                  {item.parentID != null &&
                    this.state.categories.items.find(
                      i => i.id == item.parentID,
                    ) == null && (
                      <Text style={styles.location}>
                        Main category has been removed
                      </Text>
                    )}
                </Body>
                <Right style={styles.right}>
                  <Button
                    backgroundColor="#D94526"
                    style={styles.replyButton}
                    onPress={() => this.remove(item)}>
                    <Text>Remove</Text>
                  </Button>
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
              `api/productcategories/delete/${item.id}`,
            );

            if (result.status == 200) {
              toastService.success('Delete shop category successfully!');
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
    fontSize: 13,
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
    // marginTop: 10
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
