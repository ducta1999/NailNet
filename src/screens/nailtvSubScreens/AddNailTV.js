import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Thumbnail,
  Button,
  View,
  Text,
  Card,
  CardItem,
  Body,
  Header,
  Label,
  Spinner,
  Textarea
} from "native-base";
// import ImagePicker from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import * as dataService from "../../services/DataService";
import * as formatDate from "../../services/FormatDate";
import * as toastService from "../../services/ToastService";
import * as authentication from "../../services/Authentication";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import SectionedMultiSelect from "react-native-sectioned-multi-select";

export default class AddNailTV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      title: "",
      url: "",
      description: "",
      buttonLoading: false
    };
  }

  async componentDidMount() {
    this.setState({
      loading: false
    });
  }

  async submit() {
    var user = await authentication.getLoggedInUser();
    this.setState({ buttonLoading: true });

    const { title, url, email, description } = this.state;

    if (title.trim() == "" || url.trim() == "" || description.trim() == "") {
      toastService.error("Error: " + "Input cannot be empty!");
    } else {
      var data = {
        title: title,
        url: url,
        description: description,
        createByEmail: user.email
      };

      var result = await dataService.post("api/nailtvs/add", data);

      if (result.status === 200) {
        toastService.success("Add nail tv successfully!");

        this.props.navigation.goBack();
      } else {
        toastService.error("Error: " + result.data);
      }
    }
    this.setState({ buttonLoading: false });
  }

  render() {
    const { title, url, description, loading } = this.state;

    return (
      <Container style={styles.container}>
        <Header hasTabs transparent>
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
              <View>
                <Text style={styles.title}>ADD NAIL TV</Text>
              </View>
            </View>
            <View />
          </View>
        </Header>

        <Content>
          {loading == false ? (
            <Card transparent>
              <CardItem style={styles.carditem}>
                <Content>
                  <Form>
                    <Item style={styles.item}>
                      <Label style={styles.label}>Title</Label>
                      <Input
                        placeholder="Please enter your title..."
                        placeholderTextColor="#848484"
                        onChangeText={text => this.setState({ title: text })}
                        value={title}
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item}>
                      <Label style={styles.label}>URL</Label>
                      <Input
                        placeholder="Please enter your url..."
                        placeholderTextColor="#848484"
                        onChangeText={text => this.setState({ url: text })}
                        value={url}
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item} stackedLabel>
                      <Label style={styles.label}>Description</Label>
                      <Textarea
                        placeholder="Please enter your description..."
                        placeholderTextColor="#848484"
                        rowSpan={5}
                        //bordered
                        onChangeText={text =>
                          this.setState({ description: text })
                        }
                        value={description}
                        style={styles.textArea}
                      />
                    </Item>
                  </Form>
                </Content>
              </CardItem>

              <CardItem footer style={styles.buttonGroup}>
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={styles.cancel}
                  >
                    <Text style={styles.cancelText}>CANCEL</Text>
                  </TouchableOpacity>

                  <Button
                    backgroundColor="#47BFB3"
                    style={styles.submitButton}
                    onPress={() => this.submit()}
                  >
                    {this.state.buttonLoading == true && (
                      <Spinner color="green" />
                    )}
                    <Text style={styles.submitButtonText}>SUBMIT</Text>
                  </Button>
                </View>
              </CardItem>
            </Card>
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
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2426"
  },
  title: {
    fontSize: 15,
    color: "#47BFB3",
    //marginRight: 80,
    marginTop: 10
  },
  picker: {
    marginLeft: 20,
    color: "white"
  },
  caretIcon: {
    right: 25
  },
  carditem: {
    backgroundColor: "#1F2426"
  },
  item: {
    marginBottom: 20,
    borderColor: "transparent"
  },
  label: {
    fontSize: 15,
    color: "#D94526"
  },
  input: {
    color: "white"
  },
  textArea: {
    width: "100%",
    color: "white"
  },
  cardFooter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonGroup: {
    marginTop: 80,
    backgroundColor: "#1F2426"
  },
  cancelText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  cancel: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "flex-start",
    marginTop: 10,
    marginLeft: 15
  },
  submitButton: {
    width: 150,
    justifyContent: "center"
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5
  }
});

//multiselect style
const multiSelectStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2426"
  },
  selectToggleText: { color: "white" },
  button: { backgroundColor: "#D94526" },
  searchBar: { backgroundColor: "#1F2426" },
  searchTextInput: { color: "#D94526" }
});
const color = {
  text: "#D94526",
  subText: "#47BFB3",
  searchPlaceholderTextColor: "#D94526",
  itemBackground: "#1F2426",
  subItemBackground: "#1F2426"
};
