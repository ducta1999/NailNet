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
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {
  getAnimatingBottomBar,
  AnimationType,
} from 'react-native-animating-bottom-tab-bar';
import Post from './Post';
import NailTV from './NailTV';
import Chat from './Chat';
import Job from './Job';

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
    const BottomBarStack = getAnimatingBottomBar({
      type: AnimationType.SvgBottomBar,
      navigationScreens: {
        ['ListFAQ']: () => <ListFAQ navigation={this.props.navigation} />,
        ['PublicQuestion']: () => (
          <PublicQuestion navigation={this.props.navigation} />
        ),
        ['PrivateQuestion']: () => (
          <PrivateQuestion navigation={this.props.navigation} />
        ),
      },
      navigationParameter: [
        {
          label: 'List FAQ',
          routeName: 'ListFAQ',
          icons: {
            unselected: require('../icons/listquestion_off.png'),
            selected: require('../icons/listquestion_on.png'),
          },
          inactiveTextStyle: styles.text,
          activeTextStyle: styles.text,
        },
        {
          label: 'Public Question',
          routeName: 'PublicQuestion',
          icons: {
            unselected: require('../icons/publicquestion_off.png'),
            selected: require('../icons/publicquestion_on.png'),
          },
          inactiveTextStyle: styles.text,
          activeTextStyle: styles.text,
          // isLottieTab: true,
          // lottieSource: require('../json/home.json'),
        },
        {
          label: 'Private Question',
          routeName: 'PrivateQuestion',
          icons: {
            unselected: require('../icons/privatequestion_off.png'),
            selected: require('../icons/privatequestion_on.png'),
          },
          inactiveTextStyle: styles.text,
          activeTextStyle: styles.text,
        },
      ],
      configData: {
        bottomBarConfig: {
          backgroundColor: '#001d3d',
        },
      },
    });

    const AppContainer = createAppContainer(BottomBarStack);

    return (
      <Container style={styles.container}>
        <AppContainer />
        {/* <Tabs
          transparent
          // page={this.state.activeTabValue}
          tabBarPosition="bottom"
          tabContainerStyle={{height: 60}}
          tabBarUnderlineStyle={styles.tabUnderLine}>
          <Tab
            style={styles.tabs}
            heading={
              <TouchableOpacity onPress={() => this.onChangeTab(0)}>
                <TabHeading style={styles.tabHeading}>
                  <View>
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
        </Tabs> */}
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
    borderRadius: 0,
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
});
