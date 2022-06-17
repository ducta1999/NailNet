import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
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
  Title,
  Textarea,
  Card,
  Item,
  CardItem,
  Form,
  Label,
  Picker,
  Input,
  Spinner
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import * as dataService from "../../services/DataService";
import * as toastService from "../../services/ToastService";
import * as authentication from "../../services/Authentication";
import SectionedMultiSelect from "react-native-sectioned-multi-select";

export default class AddQuestionPublic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faqindustries: [],
      loading: true,
      selectedIndustry: [],
      title: "",
      description: "",
      buttonLoading: false
    };
    this.goTabBack = this.goTabBack.bind(this);
  }

  async componentDidMount() {
    var industries = await dataService.get("api/faqindustries/getall");
    var itemIndustries = [{ name: "Industry", id: 0, children: [] }];

    for (var j = 0; j < industries.items.length; j++) {
      itemIndustries[0].children.push({
        name: industries.items[j].description,
        id: industries.items[j].id
      });
    }

    this.setState({
      loading: false,
      faqindustries: itemIndustries,
      selectedIndustry: this.state.selectedIndustry.concat[
        itemIndustries[0].children[0].id
      ]
    });
  }

  async submit() {
    this.setState({ buttonLoading: true });
    const { title, description, selectedIndustry } = this.state;

    if (title.trim() == "") {
      toastService.error("Error: "+"Title cannot be empty!");

      this.setState({ buttonLoading: false });
      return;
    }

    if (description.trim() == "") {
      toastService.error("Error: "+"dDscription cannot be empty!");

      this.setState({ buttonLoading: false });
      return;
    }

    var user = await authentication.getLoggedInUser();

    var data = {
      industryID: selectedIndustry[0],
      private: false,
      statusID: 0,
      createByEmail: user.email,
      title: title,
      description: description,
      view: 0
    };

    var result = await dataService.post("api/faqquestions/add", data);
    if (result.status === 200) {
      toastService.success("Add question successfully!");

      this.setState({ buttonLoading: false });
      this.props.navigation.goBack();
    } else {
      this.setState({ buttonLoading: false });
      toastService.error("Error: "+"Something wrong! Please check and try again");
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header transparent>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <View>
              <TouchableOpacity onPress={() => this.goTabBack()}>
                <Thumbnail
                  small
                  source={require("../../icons/left_arrow.png")}
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.headerBodyText}>ADD QUESTION PUBLIC</Text>
            </View>
            <View />
          </View>
        </Header>

        {this.state.loading == false ? (
          <Content>
            <View style={styles.card}>
              <Card>
                <CardItem style={styles.cardTitle}>
                  <Content style={{ marginLeft: -10 }}>
                    <Form>
                      <Item>
                        <Input
                          style={styles.titleInput}
                          placeholder="Title"
                          placeholderTextColor="#D94526"
                          onChangeText={text => this.setState({ title: text })}
                        />
                      </Item>

                      <View
                        style={{ marginLeft: 12, justifyContent: "center" }}
                      >
                        {this.state.loading == false && (
                          <SectionedMultiSelect
                            items={this.state.faqindustries}
                            uniqueKey="id"
                            subKey="children"
                            expandDropDowns={true}
                            selectText="Choose Industry..."
                            showDropDowns={true}
                            readOnlyHeadings={true}
                            onSelectedItemsChange={value =>
                              this.setState({ selectedIndustry: value })
                            }
                            selectedItems={this.state.selectedIndustry}
                            single={true}
                            selectToggleIconComponent={
                              <Icon
                                name="caret-down"
                                color="#D94526"
                                size={30}
                                style={styles.caretIcon}
                              />
                            }
                            searchIconComponent={
                              <Icon
                                name="search"
                                color="#D94526"
                                size={15}
                                style={{ marginLeft: 15 }}
                              />
                            }
                            colors={color}
                            styles={multiSelectStyles}
                          />
                        )}
                      </View>

                      {/* <Item>
                        {this.state.loading == false &&
                          this.state.faqindustries &&
                          this.state.faqindustries.items && (
                            <Picker
                              mode="dropdown"
                              placeholder="Choose industry"
                              iosIcon={<Icon name="arrow-down" />}
                              style={styles.picker}
                              selectedValue={this.state.selectedIndustry}
                              onValueChange={value =>
                                this.setState({ selectedIndustry: value })
                              }
                            >
                              {this.state.faqindustries.items.map(
                                (industry, i) => (
                                  <Picker.Item
                                    label={industry.description}
                                    value={industry.id}
                                    key={i}
                                  />
                                )
                              )}
                            </Picker>
                          )}
                      </Item> */}

                      <View style={styles.descriptionView}>
                        <Textarea
                          rowSpan={10}
                          bordered
                          placeholder="Description"
                          placeholderTextColor="#D94526"
                          onChangeText={text =>
                            this.setState({ description: text })
                          }
                        />
                      </View>
                    </Form>
                  </Content>
                </CardItem>
              </Card>
            </View>

            <View style={styles.submitButtonView}>
              <Button
                block
                backgroundColor="#47BFB3"
                style={styles.submitButton}
                onPress={() => this.submit()}
              >
                {this.state.buttonLoading == true && <Spinner color="red" />}
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </Button>
            </View>
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

  goTabBack() {
    this.props.navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2426"
  },
  picker: {
    marginLeft: 0,
    color: "#D94526"
  },

  headerBodyText: {
    // marginLeft: 7,
    fontSize: 20,
    color: "#47BFB3",
    marginTop: 5
  },
  card: {
    marginTop: 20,
    padding: 10
  },
  descriptionView: {
    marginTop: 10,
    marginLeft: 16
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  submitButtonView: {
    //marginTop: 30,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    marginRight: 10
  },
  submitButton: {},
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
  selectToggleText: { color: "#D94526" },
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
