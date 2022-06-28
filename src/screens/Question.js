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
            selected: require('../icons/listquestion_off.png'),
          },
          inactiveTextStyle: styles.text,
          activeTextStyle: styles.text,
        },
        {
          label: 'Public Question',
          routeName: 'PublicQuestion',
          icons: {
            unselected: require('../icons/publicquestion_off.png'),
            selected: require('../icons/publicquestion_off.png'),
          },
          inactiveTextStyle: styles.text,
          activeTextStyle: styles.text,
        },
        {
          label: 'Private Question',
          routeName: 'PrivateQuestion',
          icons: {
            unselected: require('../icons/privatequestion_off.png'),
            selected: require('../icons/privatequestion_off.png'),
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

  text: {
    color: 'white',
    fontSize: 12,
  },
});
