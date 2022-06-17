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

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      categories: []
    };

    this.gotoQuestionDetail = this.gotoQuestionDetail.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.ensureDataFetched();
  }

  componentDidMount() {
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    var categories = await dataService.get(`api/faqindustries/getall`);
    console.log(categories);
    this.setState({
      categories: categories,
      loading: false
    });
  }

  render() {
    return (
      <Content>
        {this.state.loading == false ? (
          <ScrollView>
            <List>
              {this.state.categories &&
                this.state.categories.items &&
                this.state.categories.items.map((item, i) => (
                  <ListItem
                    avatar
                    key={i}
                    noBorder
                    // onPress={() => this.gotoQuestionDetail(item.id)}
                  >
                    <Body>
                      <Text style={styles.name}>{item.description}</Text>
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
              `api/faqindustries/delete/${item.id}`
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
