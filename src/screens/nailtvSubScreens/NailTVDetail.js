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
import YouTube from "react-native-youtube";

export default class NailTVDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.navigation.state.params.id,
      //id: 1,
      nailTV: [],
      loading: true,
      email: [],
      user: []
    };

    if (props.navigation.state.params && props.navigation.state.params.id) {
      this.ensureDataFetched(props.navigation.state.params.id);
    }
    //this.ensureDataFetched(1);
  }

  async ensureDataFetched(id) {
    var user = await authentication.getLoggedInUser();
    var email = user.email;

    var nailTV = await dataService.get("api/nailtvs/getnailtv/" + id);

    this.setState({
      nailTV: nailTV,
      loading: false,
      email: email,
      user: user
    });
  }

  render() {
    const { loading, nailTV } = this.state;

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
              <Title style={styles.headerBodyText}>Nail TV Detail</Title>
            </View>
            <View />
          </View>
        </Header>
        {loading == false ? (
          <Content>
            <Card style={{ flex: 0, marginTop: 5 }} transparent>
              {/* <CardItem style={styles.carditem}>
                <Body />
              </CardItem> */}
              <CardItem style={styles.carditem}>
                <Body>
                  <Text style={styles.title}>{nailTV.title}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text
                    style={styles.link}
                    onPress={() => Linking.openURL(nailTV.url)}
                  >
                    Url: {nailTV.url}
                  </Text>

                  <YouTube
                    apiKey={constant.API_YOUTUBE_KEY}
                    //videoId="nRBc7kJKs2A" // The YouTube video ID
                    videoId={this.getVideoID(nailTV.url)}
                    play={false} // control playback of video with true/false
                    fullscreen={false} // control whether the video should play in fullscreen or inline
                    loop={true} // control whether the video should loop when ended
                    // onReady={e => this.setState({ isReady: true })}
                    // onChangeState={e => this.setState({ status: e.state })}
                    // onChangeQuality={e => this.setState({ quality: e.quality })}
                    // onError={e => this.setState({ error: e.error })}
                    style={{ alignSelf: "stretch", height: 300 }}
                    control={1}
                  />
                </Body>
              </CardItem>

              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.normal}>{nailTV.description}</Text>
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
      </Container>
    );
  }

  getVideoID(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
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
  link: {
    color: "blue",
    fontSize: 15
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5
  }
});
