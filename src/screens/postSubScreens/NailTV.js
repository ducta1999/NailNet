import React, {Component} from 'react';
import {StyleSheet, Alert, ScrollView, TouchableOpacity} from 'react-native';
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
  Button,
  ScrollableTab,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from '../../services/DataService';
import * as authentication from '../../services/Authentication';
import * as constant from '../../services/Constant';
import * as toastService from '../../services/ToastService';

export default class NailTV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      selectedCategory: null,
      nailTVs: [],
    };
  }

  async componentDidMount() {
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    var user = await authentication.getLoggedInUser();
    var nailTVs = await dataService.get(
      `api/nailtvs/getall?email=${user.email}&sortby=createtime`,
    );
    this.setState({
      loading: false,
      nailTVs: nailTVs,
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          {this.state.loading == false ? (
            <View>
              <View style={{flex: 1, backgroundColor: '#1F2426'}}>
                {this.renderListItem(this.state.nailTVs.items)}
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
        </Content>
      </Container>
    );
  }

  renderListItem(items) {
    return (
      <View>
        {items && items.length != 0 ? (
          <ScrollView>
            <List style={styles.list}>
              {items.map((item, i) => (
                <ListItem
                  avatar
                  key={i}
                  onPress={() =>
                    this.props.navigation.navigate('NailTVPostDetail', {
                      id: item.id,
                      onGoBack: () => this.ensureDataFetched(),
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
                    <Text style={styles.location}>Url: {item.url}</Text>
                    <Text style={{color: 'white', fontSize: 13}}>
                      Status:{' '}
                      {item.isApproved == true
                        ? 'Approved'
                        : 'Not Approved Yet'}
                    </Text>
                    <Button
                      backgroundColor="#D94526"
                      style={styles.replyButton}
                      onPress={() => this.remove(item)}>
                      <Text>Remove</Text>
                    </Button>
                  </Body>
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
              `api/nailtvs/delete/${item.id}`,
            );

            if (result.status == 200) {
              toastService.success('Delete Nail TV successfully!');
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
  list: {
    //height: 400,
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
    marginTop: 10,
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
