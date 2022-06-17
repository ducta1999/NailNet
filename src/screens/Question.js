import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  Container,
  Content,
  Thumbnail,
  Button,
  View,
  Text,
  Left,
  Body,
  Right,
  Icon,
  Tabs,
  Tab,
  TabHeading,
  Header,
  Title,
  Input,
  Item,
  ScrollableTab,
} from 'native-base';
import PublicQuestion from './questionSubScreens/PublicQuestion';
import PrivateQuestion from './questionSubScreens/PrivateQuestion';
import ListFAQ from './questionSubScreens/ListFAQ';
// import { TouchableOpacity } from "react-native-gesture-handler";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabPage: 0,
      activeTabValue: 0,
      searchText: '',
    };

    this.onChangeTab = this.onChangeTab.bind(this);
  }

  onChangeTab(e) {
    console.log(e);
    this.setState({
      tabPage: e,
      activeTabValue: e,
    });
  }

  render() {
    console.log(this.state.tabPage);
    console.log(this.state.activeTabValue);
    return (
      <Container style={styles.container}>
        <Header hasTabs searchBar transparent>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
            <View>
              {this.state.tabPage == 0 && (
                // <Icon
                //   name="menu"
                //   style={styles.iconMenu}
                //   onPress={() => this.onpenDrawer()}
                // />
                <TouchableOpacity onPress={() => this.onpenDrawer()}>
                  <Thumbnail
                    small
                    source={require('../icons/menu.png')}
                    style={styles.thumbnail}
                  />
                </TouchableOpacity>
              )}
              {this.state.tabPage != 0 && (
                <TouchableOpacity onPress={() => this.goTabBack()}>
                  <Thumbnail
                    small
                    source={require('../icons/left_arrow.png')}
                    style={styles.thumbnail}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View>
              {this.state.tabPage == 0 && (
                <Input
                  placeholder="Enter name to search"
                  placeholderTextColor="#848484"
                  style={styles.input}
                  onSubmitEditing={event =>
                    this.setState({searchText: event.nativeEvent.text})
                  }
                />
              )}
              {this.state.tabPage == 1 && (
                <View>
                  <Text style={styles.title}>PUBLIC QUESTION LIST</Text>
                </View>
              )}
              {this.state.tabPage == 2 && (
                <View>
                  <Text style={styles.title}>PRIVATE QUESTION LIST</Text>
                </View>
              )}
            </View>

            <View>
              <View>
                <TouchableOpacity onPress={() => this.openAddQuestionPage()}>
                  <Thumbnail
                    source={require('../icons/edit.png')}
                    style={styles.thumbnail}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Header>
        <Tabs
          transparent
          // page={this.state.activeTabValue}
          tabBarPosition="bottom"
          tabContainerStyle={{height: 60}}
          tabBarUnderlineStyle={styles.tabUnderLine}
          // onChangeTab={this.onChangeTab}
          //locked
        >
          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(0)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    {/* {this.state.tabPage != 0 && (
                      <View style={styles.tabHeadingContent}>
                        <Thumbnail
                          small
                          source={require("../icons/listquestion_off.png")}
                        />
                        <Text style={styles.tabHeadingText}>List</Text>
                      </View>
                    )}

                    {this.state.tabPage == 0 && (
                      <View style={styles.tabHeadingContent}>
                        <Thumbnail
                          small
                          source={require("../icons/listquestion_on.png")}
                        />
                        <Text style={styles.tabHeadingTextOn}>List</Text>
                      </View>
                    )} */}
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/listquestion_off.png')}
                      />
                      <Text style={styles.tabHeadingText}>List</Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <ListFAQ
              //onChangeTab={this.onChangeTab}
              navigation={this.props.navigation}
              searchText={this.state.searchText}
            />
          </Tab>
          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(1)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    {/* {this.state.tabPage != 1 && (
                      <View style={styles.tabHeadingContent}>
                        <Thumbnail
                          small
                          source={require("../icons/publicquestion_off.png")}
                        />
                        <Text style={styles.tabHeadingText}>
                          Public Question
                        </Text>
                      </View>
                    )}

                    {this.state.tabPage == 1 && (
                      <View style={styles.tabHeadingContent}>
                        <Thumbnail
                          small
                          source={require("../icons/publicquestion_on.png")}
                        />
                        <Text style={styles.tabHeadingTextOn}>
                          Public Question
                        </Text>
                      </View>
                    )} */}
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/publicquestion_off.png')}
                      />
                      <Text style={styles.tabHeadingText}>Public Question</Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <PublicQuestion
              navigation={this.props.navigation}
              onChangeTab={this.onChangeTab}
            />
          </Tab>
          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(2)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    {/* {this.state.tabPage != 2 && (
                      <View style={styles.tabHeadingContent}>
                        <Thumbnail
                          small
                          source={require("../icons/privatequestion_off.png")}
                        />
                        <Text style={styles.tabHeadingText}>
                          Private Question
                        </Text>
                      </View>
                    )}

                    {this.state.tabPage == 2 && (
                      <View style={styles.tabHeadingContent}>
                        <Thumbnail
                          small
                          source={require("../icons/privatequestion_on.png")}
                        />
                        <Text style={styles.tabHeadingTextOn}>
                          Private Question
                        </Text>
                      </View>
                    )} */}
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/privatequestion_off.png')}
                      />
                      <Text style={styles.tabHeadingText}>
                        Private Question
                      </Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <PrivateQuestion
              navigation={this.props.navigation}
              onChangeTab={this.onChangeTab}
            />
          </Tab>
        </Tabs>
      </Container>
    );
  }

  goTabBack() {
    this.setState({
      tabPage: this.state.tabPage - 1,
      activeTabValue: this.state.activeTabValue - 1,
    });
  }

  onpenDrawer() {
    this.props.navigation.openDrawer();
  }

  openAddQuestionPage() {
    this.props.navigation.navigate('AddQuestionPublic');
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  tabUnderLine: {
    backgroundColor: '#1F2426',
  },
  tabHeading: {
    marginLeft: 1,
    borderLeftWidth: 0.5,
    borderLeftColor: 'white',
    borderRightWidth: 0.5,
    borderRightColor: 'white',
    borderTopWidth: 0.5,
    borderTopColor: 'white',
    backgroundColor: '#1F2426',
  },
  tabHeadingText: {
    fontSize: 10,
    color: '#ffffff',
  },
  tabHeadingTextOn: {
    fontSize: 10,
    color: '#47BFB3',
  },
  tabHeadingContent: {
    alignItems: 'center',
  },
  tabs: {
    backgroundColor: '#1F2426',
  },
  title: {
    fontSize: 15,
    color: '#47BFB3',
    //marginRight: 80,
    marginTop: 10,
  },

  faqTitle: {
    justifyContent: 'center',
    fontSize: 15,
    color: '#47BFB3',

    //marginRight: 140,
    marginTop: 10,
  },

  iconMenu: {
    fontSize: 40,
    color: 'white',
  },
  input: {
    // alignItems: "center",
    marginTop: -10,
    color: 'white',
    // marginLeft: -50,
    // marginRight: -20
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});
