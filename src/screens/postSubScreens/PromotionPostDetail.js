import * as authentication from "../../services/Authentication";
import * as dataService from "../../services/DataService";
import * as toastService from "../../services/ToastService";
import * as constant from "../../services/Constant";
import React, { Component } from "react";
import * as formatDate from "../../services/FormatDate";
import { StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import Slideshow from "react-native-image-slider-show";
import NumericInput from "react-native-numeric-input";
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
  Input,
  Spinner,
  Tabs,
  Tab,
  Icon,
  TabHeading
} from "native-base";
//import Icon from "react-native-vector-icons/FontAwesome";

export default class PromotionPostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.navigation.state.params.id,
      //id: 1,
      promotion: [],
      loading: true,
      email: [],
      user: [],
      category: [],
      dataSource: []
    };

    if (props.navigation.state.params && props.navigation.state.params.id) {
      this.ensureDataFetched(props.navigation.state.params.id);
    }
    this.removeIconClick = this.removeIconClick.bind(this);
    //this.ensureDataFetched(1);
  }

  async ensureDataFetched(id) {
    var user = await authentication.getLoggedInUser();
    var email = user.email;

    var promotion = await dataService.get("api/promotions/getpromotion/" + id);

    var dataSource = [];
    for (var i = 0; i < promotion.pictures.length; i++) {
      dataSource.push({
        url:
          constant.BASE_URL +
          "api/promotionpictures/getimage/" +
          promotion.pictures[i].id
      });
    }
    if (promotion.pictures.length == 0) {
      dataSource.push({
        url: "http://www.daotao-vaas.org.vn/Images/noimage.gif"
      });
    }

    var category = await dataService.get(
      "api/promotioncategories/getpromotioncategory/" + promotion.categoryID
    );

    this.setState({
      promotion: promotion,
      loading: false,
      email: email,
      user: user,
      category: category,
      dataSource: dataSource
    });
  }

  async removeIconClick() {
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
              `api/promotions/delete/${this.state.promotion.id}`
            );

            if (result.status == 200) {
              toastService.success("Delete promotion successfully!");
              this.props.navigation.state.params.onGoBack();
              this.props.navigation.goBack();
            } else {
              toastService.error("Error: " + result.data);
            }
          }
        }
      ],
      { cancelable: false }
    );
  }

  render() {
    const {
      loading,
      promotion,
      id,
      email,
      user,
      category,
      dataSource
    } = this.state;

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
              <Title style={styles.headerBodyText}>Promotion Detail</Title>
            </View>
            <View>
              <TouchableOpacity onPress={() => this.removeIconClick()}>
                <Icon
                  name="trash"
                  style={{ fontSize: 30, color: "white" }}
                  //style={styles.caretIcon}
                />
              </TouchableOpacity>
            </View>
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
                  <Text style={styles.title}>{promotion.title}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.discount}>
                    Discount: {promotion.discount} %
                  </Text>
                  <Text style={styles.normal}>
                    Category: {category.description}
                  </Text>
                  <Text style={styles.normal}>{promotion.last}</Text>
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
                        promotion.createByEmail +
                        "?random_number=" +
                        new Date().getTime()
                    }}
                  />
                </Left>
                <Body>
                  <Text style={styles.normal}>Email:{promotion.email}</Text>
                  <Text style={styles.normal}>Phone:{promotion.phone}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.normal}>{promotion.description}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.normal}>
                    Location: {promotion.location}
                  </Text>
                </Body>
              </CardItem>
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
