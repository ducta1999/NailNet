import React, { Component } from "react";
import { StyleSheet, ScrollView } from "react-native";
import {
  View,
  Text,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Button,
  Spinner
} from "native-base";
import * as authentication from "../../services/Authentication";
import * as dataService from "../../services/DataService";
import * as constant from "../../services/Constant";
import * as toastService from "../../services/ToastService";

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      profiles: []
    };

    this.gotoProfileDetail = this.gotoProfileDetail.bind(this);
    this.approve = this.approve.bind(this);
  }

  componentDidMount() {
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    var user = await authentication.getLoggedInUser();

    var profiles = await dataService.get(
      `api/profiles/getall?isapproved=false`
    );

    profiles.items = profiles.items.filter(i => i.occupationID != 1);

    this.setState({
      profiles: profiles,
      loading: false
    });
  }

  render() {
    return (
      <Content>
        {this.state.loading == false ? (
          <ScrollView>
            <List>
              {this.state.profiles &&
                this.state.profiles.items &&
                this.state.profiles.items.map((item, i) => (
                  <ListItem
                    avatar
                    key={i}
                    noBorder
                    onPress={() => this.gotoProfileDetail(item.id)}
                  >
                    <Left>
                      <Thumbnail
                        small
                        defaultSource={{ uri: "avatar" }}
                        source={{
                          uri:
                            constant.BASE_URL +
                            "api/avatars/getimage/" +
                            item.email +
                            "?random_number=" +
                            new Date().getTime()
                        }}
                        //source={require("../../icons/Avatar.png")}
                      />
                    </Left>
                    <Body>
                      <Text style={styles.name}>
                        {item.firstName} {item.lastName}
                      </Text>

                      <Text style={styles.title}>
                        BusinessName: {item.businessName}
                      </Text>
                      <Text
                        style={styles.summary}
                        numberOfLines={2}
                        ellipsizeMode={"tail"}
                      >
                        Business Address: {item.businessAddress}
                      </Text>
                      <Text
                        style={styles.summary}
                        numberOfLines={2}
                        ellipsizeMode={"tail"}
                      >
                        Business Summary: {item.businessSummary}
                      </Text>
                    </Body>
                    <Right style={styles.right}>
                      <Button
                        backgroundColor="#47BFB3"
                        style={styles.replyButton}
                        onPress={() => this.approve(item)}
                      >
                        <Text>Approve</Text>
                      </Button>
                    </Right>
                  </ListItem>
                ))}
            </List>
          </ScrollView>
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
      </Content>
    );
  }

  gotoProfileDetail(id) {
    this.props.navigation.navigate("UserDetail", {
      id: id,
      onGoBack: () => this.ensureDataFetched()
    });
  }

  async approve(item) {
    var data = {
      ...item,
      isApproved: true
    };

    var result = await dataService.put(`api/profiles/update/${data.id}`, data);

    if (result.status == 200) {
      toastService.success("Approve profile successfully!");
      this.ensureDataFetched();
    } else {
      toastService.error("Error: " + result.data);
    }
  }
}

const styles = StyleSheet.create({
  name: {
    color: "#D94526",
    fontWeight: "bold"
  },
  question: {
    color: "white"
  },
  title: {
    color: "#47BFB3",
    fontSize: 12
  },
  summary: {
    color: "white",
    fontSize: 12
  },
  footerGroupText: {
    color: "#47BFB3",
    fontSize: 12
  },
  footerGroup: {
    flex: 1,
    flexDirection: "row"
  },
  footerGroupView: {
    marginRight: 20
  },
  right: {
    marginTop: 15,
    marginLeft: 15
  },
  replyButton: {
    height: 30
  }
});
