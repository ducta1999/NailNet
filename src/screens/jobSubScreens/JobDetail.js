import * as authentication from "../../services/Authentication";
import * as dataService from "../../services/DataService";
import * as constant from "../../services/Constant";
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import Slideshow from "react-native-image-slider-show";
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
  Icon,
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
  TabHeading
} from "native-base";

export default class JobDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.navigation.state.params.id,
      //id: 1,
      job: [],
      loading: true,
      email: [],
      user: [],
      category: [],
      dataSource: []
    };

    if (props.navigation.state.params && props.navigation.state.params.id) {
      this.ensureDataFetched(props.navigation.state.params.id);
    }
    //this.ensureDataFetched(1);
  }

  async ensureDataFetched(id) {
    var user = await authentication.getLoggedInUser();
    var email = user.email;

    var job = await dataService.get("api/jobs/getjob/" + id);

    var dataSource = [];
    for (var i = 0; i < job.pictures.length; i++) {
      dataSource.push({
        url: constant.BASE_URL + "api/jobimages/getimage/" + job.pictures[i].id
      });
    }
    if (job.pictures.length == 0) {
      dataSource.push({
        url: "http://www.daotao-vaas.org.vn/Images/noimage.gif"
      });
    }

    var category = await dataService.get(
      "api/jobcategories/getjobcategory/" + job.categoryID
    );

    this.setState({
      job: job,
      loading: false,
      email: email,
      user: user,
      category: category,
      dataSource: dataSource
    });
  }

  render() {
    const { loading, job, id, email, user, category, dataSource } = this.state;

    return (
      <Container style={styles.container}>
        <Header transparent>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8
            }}
          >
            <View>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Thumbnail
                  small
                  source={require("../../icons/left_arrow.png")}
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Title style={styles.headerBodyText}>Job Detail</Title>
            </View>
            <View />
          </View>
        </Header>
        {loading == false ? (
          <Content>
            <Slideshow dataSource={dataSource} />
            <Card style={{ flex: 0, marginTop: 5 }} transparent>
              {/* <CardItem style={styles.carditem}>
                <Body />
              </CardItem> */}
              <CardItem style={styles.carditem}>
                <Body>
                  <Text style={styles.title}>{job.title}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.discount}>Price: {job.price}/h</Text>
                  <Text style={styles.normal}>From: {job.fromDate}</Text>
                  <Text style={styles.normal}>To: {job.toDate}</Text>
                  <Text style={styles.normal}>
                    Category: {category.description}
                  </Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Left>
                  <Thumbnail
                    //source={require("../../icons/Avatar.png")}
                    defaultSource={{ uri: "avatar" }}
                    source={{
                      uri:
                        constant.BASE_URL +
                        "api/avatars/getimage/" +
                        job.createByEmail +
                        "?random_number=" +
                        new Date().getTime()
                    }}
                  />
                </Left>
                <Body>
                  <Text style={styles.normal}>Email:{job.email}</Text>
                  <Text style={styles.normal}>Phone:{job.phone}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.normal}>{job.description}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.normal}>Address: {job.address}</Text>
                </Body>
              </CardItem>
              <CardItem style={{ height: 60, backgroundColor: "#1F2426" }} />
            </Card>
          </Content>
        ) : (
          <View>
            <Spinner color="red" />
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold"
              }}
            >
              Loading
            </Text>
          </View>
        )}

        <Tabs
          transparent
          tabBarUnderlineStyle={styles.tabUnderLine}
          style={{
            position: "absolute",
            bottom: 0,
            height: 60
          }}
          initialPage={5}
          tabBarPosition="bottom"
          //   //renderTabBar={() => <ScrollableTab />}
        >
          <Tab
            heading={
              <TabHeading
                style={styles.tabHeading}
                onPress={() => Linking.openURL(`tel:${job.phone}`)}
              >
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${job.phone}`)}
                  style={{ flexDirection: "row" }}
                >
                  <Icon name="call" color="white" />
                  <Text style={{ color: "white" }}>Call</Text>
                </TouchableOpacity>
              </TabHeading>
            }
            style={styles.tabs}
          />
          <Tab
            heading={
              <TabHeading style={styles.tabHeading}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`sms:${job.phone}`)}
                  style={{ flexDirection: "row" }}
                >
                  <Icon name="send" color="white" />
                  <Text style={{ color: "white" }}>SMS</Text>
                </TouchableOpacity>
              </TabHeading>
            }
            style={styles.tabs}
          />
          <Tab
            heading={
              <TabHeading style={styles.tabHeading}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Chat", {
                      senderEmail: email,
                      receiverEmail: job.createByEmail
                    })
                  }
                  style={{ flexDirection: "row" }}
                >
                  <Icon name="chatboxes" />
                  <Text style={{ color: "white" }}>Chat</Text>
                </TouchableOpacity>
              </TabHeading>
            }
            style={styles.tabs}
          />
        </Tabs>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2426"
  },
  carditem: {
    backgroundColor: "#1F2426"
  },
  headerBodyText: {
    justifyContent: "center",
    //left: 30,
    fontSize: 20,
    marginTop: 5,
    color: "#47BFB3"
  },
  tabUnderLine: {
    display: "none",
    backgroundColor: "#D94526"
  },
  tabHeading: {
    backgroundColor: "#D94526"
    // borderBottomWidth: 1,
    // borderBottomColor: "white"
  },
  tabs: {
    backgroundColor: "#D94526",
    borderWidth: 0
  },
  title: {
    color: "#D94526",
    fontSize: 30,
    fontWeight: "bold"
  },
  discount: {
    color: "red",
    fontSize: 15
  },
  normal: {
    color: "white",
    fontSize: 15
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5
  }
});
