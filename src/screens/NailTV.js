import React, {Component} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
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
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from '../services/DataService';
import * as authentication from '../services/Authentication';
import * as constant from '../services/Constant';

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
    var nailTVs = await dataService.get(`api/nailtvs/getall?isApproved=true`);
    this.setState({
      loading: false,
      nailTVs: nailTVs,
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header hasTabs transparent>
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
              <Text style={styles.title}>NailTV</Text>
            </View>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('AddNailTV')}>
                  <Thumbnail
                    source={require('../icons/edit.png')}
                    style={styles.thumbnail}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Header>

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
                    this.props.navigation.navigate('NailTVDetail', {
                      id: item.id,
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
