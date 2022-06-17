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
  ScrollableTab,
  Item,
} from 'native-base';
import PublicQuestion from './questionSubScreens/PublicQuestion';
import PrivateQuestion from './questionSubScreens/PrivateQuestion';
import ListFAQ from './questionSubScreens/ListFAQ';
// import { TouchableOpacity } from "react-native-gesture-handler";
import User from '../screens/configSubScreens/User';
import Promotion from '../screens/configSubScreens/Promotion';
import Question from './configSubScreens/Question';
import Job from './configSubScreens/Job';
import Shop from './configSubScreens/Shop';
import Classified from './configSubScreens/Classified';
import NailTV from './configSubScreens/NailTV';

export default class Config extends Component {
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
    this.setState({
      tabPage: e,
      activeTabValue: e,
    });
  }

  render() {
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
              <View>
                <Text style={styles.title}>CONFIG</Text>
              </View>
              {/* {this.state.tabPage == 0 && (
                <View>
                  <Text style={styles.title}>USER</Text>
                </View>
              )}
              {this.state.tabPage == 1 && (
                <View>
                  <Text style={styles.title}>FAQ</Text>
                </View>
              )}
              {this.state.tabPage == 2 && (
                <View>
                  <Text style={styles.title}>PROMOTION</Text>
                </View>
              )}
              {this.state.tabPage == 3 && (
                <View>
                  <Text style={styles.title}>JOB</Text>
                </View>
              )}
              {this.state.tabPage == 4 && (
                <View>
                  <Text style={styles.title}>SHOP</Text>
                </View>
              )}
              {this.state.tabPage == 5 && (
                <View>
                  <Text style={styles.title}>CLASSIFIED</Text>
                </View>
              )}
              {this.state.tabPage == 6 && (
                <View>
                  <Text style={styles.title}>NAIL TV</Text>
                </View>
              )} */}
            </View>

            <View />
          </View>
        </Header>
        <Tabs
          transparent
          //page={this.state.activeTabValue}
          tabBarPosition="bottom"
          tabContainerStyle={{height: 60}}
          tabBarUnderlineStyle={styles.tabUnderLine}
          //onChangeTab={this.onChangeTab}
          //locked
        >
          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(0)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/signupicon_name.png')}
                      />
                      <Text style={styles.tabHeadingText}>User</Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <User navigation={this.props.navigation} />
          </Tab>

          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(1)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/icon_faq.png')}
                      />
                      <Text style={styles.tabHeadingTextOn}>FAQ</Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <Question navigation={this.props.navigation} />
          </Tab>

          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(2)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/icon_promotion.png')}
                      />
                      <Text style={styles.tabHeadingText}>Promotion</Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <Promotion navigation={this.props.navigation} />
          </Tab>

          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(3)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/icon_jobs.png')}
                      />
                      <Text style={styles.tabHeadingText}>Job</Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <Job navigation={this.props.navigation} />
          </Tab>

          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(4)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/icon_supplies.png')}
                      />
                      <Text style={styles.tabHeadingText}>Supplies</Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <Shop navigation={this.props.navigation} />
          </Tab>

          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(5)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/icon_classifield.png')}
                      />
                      <Text style={styles.tabHeadingText}>Classified</Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <Classified navigation={this.props.navigation} />
          </Tab>

          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(6)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
                    <View style={styles.tabHeadingContent}>
                      <Thumbnail
                        small
                        source={require('../icons/icon_nailtv.png')}
                      />
                      <Text style={styles.tabHeadingText}>Nail TV</Text>
                    </View>
                  </View>
                </TabHeading>
              </TouchableOpacity>
            }>
            <NailTV navigation={this.props.navigation} />
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
