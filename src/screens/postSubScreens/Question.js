import React, { Component } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
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
import * as toastService from "../../services/ToastService";
import * as constant from "../../services/Constant";

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      questions: []
    };

    this.gotoQuestionDetail = this.gotoQuestionDetail.bind(this);
  }

  componentDidMount() {
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    var user = await authentication.getLoggedInUser();

    var items = await dataService.get(
      `api/faqquestions/getall?email=${user.email}&sortby=createtime`
    );

    this.setState({
      questions: items,
      loading: false
    });
  }

  render() {
    return (
      <Content>
        {this.state.loading == false ? (
          <ScrollView>
            <List>
              {this.state.questions &&
                this.state.questions.items &&
                this.state.questions.items.map((item, i) => (
                  <ListItem
                    avatar
                    key={i}
                    noBorder
                    onPress={() => this.gotoQuestionDetail(item.id)}
                  >
                    <Left>
                      <Thumbnail
                        small
                        //source={require("../../icons/Avatar.png")}
                        defaultSource={{ uri: "avatar" }}
                        source={{
                          uri:
                            constant.BASE_URL +
                            "api/avatars/getimage/" +
                            item.createByEmail +
                            "?random_number=" +
                            new Date().getTime()
                        }}
                      />
                    </Left>
                    <Body>
                      <Text style={styles.name}>{item.fullName}</Text>

                      {item.answers.length == 0 ? (
                        <Text style={styles.question} numberOfLines={2}>
                          {item.description}
                        </Text>
                      ) : (
                        <Text style={styles.question} numberOfLines={2}>
                          {
                            item.answers[item.answers.length - 1]
                              .answerDescription
                          }
                        </Text>
                      )}

                      <Text style={styles.title}>Title: {item.title}</Text>
                      <Text style={styles.category}>
                        Category: {item.industry.description}
                      </Text>
                      <View style={styles.footerGroup}>
                        <View style={styles.footerGroupView}>
                          <Text style={styles.footerGroupText}>
                            Post date: {item.createTime}
                          </Text>
                        </View>

                        <View style={styles.footerGroupView}>
                          <Text style={styles.footerGroupText}>
                            View: {item.view}
                          </Text>
                        </View>

                        <View style={styles.footerGroupView}>
                          <Text style={styles.footerGroupText}>
                            Answer: {item.answers.length}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: "white", fontSize: 13 }}>
                        Status:{" "}
                        {item.isApproved == true
                          ? "Approved"
                          : "Not Approved Yet"}
                      </Text>
                    </Body>
                    <Right style={styles.right}>
                      <Button
                        backgroundColor="#D94526"
                        style={styles.replyButton}
                        onPress={() => this.remove(item)}
                      >
                        <Text>Remove</Text>
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

  async gotoQuestionDetail(id) {
    this.props.navigation.navigate("QuestionPostDetail", {
      id: id,
      onGoBack: () => this.ensureDataFetched()
    });
  }

  async remove(item) {
    Alert.alert(
      "Delete Confirm",
      "Would you like to delete this item?",
      [
        {
          text: "NO, thanks"
        },
        {
          text: "OK",
          onPress: async () => {
            var result = await dataService.remove(
              `api/faqquestions/delete/${item.id}`
            );

            if (result.status == 200) {
              toastService.success("Delete question successfully!");
              this.ensureDataFetched();
            } else {
              toastService.error("Error: " + result.data);
            }
          }
        }
      ],
      { cancelable: false }
    );
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
  category: {
    color: "#47BFB3",
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
