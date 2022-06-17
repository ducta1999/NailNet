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
      `api/faqquestions/getall?isapproved=false&sortby=createtime`
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

  async gotoQuestionDetail(id) {
    this.props.navigation.navigate("QuestionConfigDetail", {
      id: id,
      onGoBack: () => this.ensureDataFetched()
    });
  }

  async approve(item) {
    var data = {
      ...item,
      isApproved: true,
      answers: null,
      industry: null,
      proProfile: null
    };

    var result = await dataService.put(
      `api/faqquestions/update/${data.id}`,
      data
    );

    if (result.status == 200) {
      toastService.success("Approve question successfully!");
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
