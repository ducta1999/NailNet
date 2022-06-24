import * as authentication from '../../services/Authentication';
import * as dataService from '../../services/DataService';
import * as constant from '../../services/Constant';
import * as toastService from '../../services/ToastService';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Linking, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSelect from '../Components/MultiSelect';
import {
  Container,
  Content,
  Thumbnail,
  Button,
  View,
  Text,
  Header,
  Left,
  Body,
  Right,
  Title,
  Textarea,
  Card,
  Item,
  CardItem,
  Form,
  Label,
  Input,
  Spinner,
  Tabs,
  Tab,
  TabHeading,
} from 'native-base';
//import Icon from "react-native-vector-icons/FontAwesome";

export default class ClassifiedAdminAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      selectedCategory: [],
      loading: true,
    };
  }
  async componentDidMount() {
    var categories = await dataService.get(
      'api/classifiedcategories/getallmain',
    );
    var itemCategories = [{name: 'Category', id: 0, children: []}];
    itemCategories[0].children.push({
      name: 'No Main Category',
      id: null,
    });
    for (var j = categories.items.length - 1; j >= 0; j--) {
      itemCategories[0].children.push({
        name: categories.items[j].description,
        id: categories.items[j].id,
      });
    }

    this.setState({
      categories: itemCategories,
      loading: false,
    });
  }

  render() {
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
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back-outline" color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <View>
              <Title style={styles.headerBodyText}>
                Add Classified Category
              </Title>
            </View>
            <View />
          </View>
        </Header>
        <Content>
          {this.state.loading == false ? (
            <View>
              <View>
                <View
                  style={{
                    marginLeft: 10,
                    justifyContent: 'center',
                  }}>
                  {this.state.loading == false && (
                    <MultiSelect
                      backgroundColor="#0065ff"
                      items={this.state.categories}
                      placeHolder="Choose category"
                      selectedItems={this.state.selectedCategory}
                      setSelectedItems={value => {
                        this.setState({selectedCategory: value});
                      }}
                    />
                  )}
                </View>
              </View>
              <View style={styles.card}>
                <Card>
                  <CardItem style={styles.cardTitle}>
                    <Content>
                      <Form>
                        <View style={styles.descriptionView}>
                          <Textarea
                            rowSpan={5}
                            bordered
                            placeholder="Enter your classified category decription"
                            placeholderTextColor="#D94526"
                            onChangeText={text =>
                              this.setState({description: text})
                            }
                          />
                        </View>
                      </Form>
                    </Content>
                  </CardItem>
                </Card>
              </View>
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

          <View style={styles.submitButtonView}>
            <Button
              block
              backgroundColor="#47BFB3"
              style={styles.submitButton}
              onPress={() => this.submit()}>
              {this.state.buttonLoading == true && <Spinner color="red" />}
              <Text style={styles.submitButtonText}>SUBMIT</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }

  async submit() {
    this.setState({buttonLoading: true});
    const {description, selectedCategory} = this.state;

    if (description.trim() == '') {
      toastService.error('Error: ' + 'Description cannot be empty!');

      this.setState({buttonLoading: false});
      return;
    }

    var user = await authentication.getLoggedInUser();

    var data = {
      description: description,
      createByEmail: user.email,
      parentID: selectedCategory ? selectedCategory[0] : null,
    };

    var result = await dataService.post('api/classifiedcategories/add', data);
    if (result.status === 200) {
      toastService.success('Add classified category successfully!');

      this.setState({buttonLoading: false});
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack();
    } else {
      this.setState({buttonLoading: false});
      toastService.error(
        'Error: ' + 'Something wrong! Please check and try again',
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  avatar: {
    alignItems: 'center',
  },
  informationView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 40,
  },
  name: {
    fontWeight: 'bold',
    color: '#D94526',
    fontSize: 15,
  },
  information: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  thumbnail: {
    width: 150,
    height: 150,
  },

  headerBodyText: {
    justifyContent: 'center',
    //left: 30,
    fontSize: 20,
    color: '#47BFB3',
    marginTop: 5,
  },

  descriptionView: {
    marginTop: 10,
    marginLeft: 16,
  },
  titleInput: {
    //marginLeft: -70
  },
  card: {
    //marginTop: 20,
    padding: 10,
  },
  cardHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D94526',
  },
  cardHeaderText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardTitle: {
    //marginTop: -20
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButtonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {},
  thumbnailArrow: {
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
