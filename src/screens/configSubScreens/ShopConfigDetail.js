import * as authentication from '../../services/Authentication';
import * as dataService from '../../services/DataService';
import * as constant from '../../services/Constant';
import * as toastService from '../../services/ToastService';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Linking} from 'react-native';
import Slideshow from 'react-native-image-slider-show';
import NumericInput from 'react-native-numeric-input';

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
  TabHeading,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default class ShopConfigDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.navigation.state.params.id,
      product: [],
      loading: true,
      email: [],
      user: [],
      category: [],
      dataSource: [],
    };

    if (props.navigation.state.params && props.navigation.state.params.id) {
      this.ensureDataFetched(props.navigation.state.params.id);
    }
    //this.ensureDataFetched(1);
  }

  async ensureDataFetched(id) {
    var user = await authentication.getLoggedInUser();
    var email = user.email;

    var product = await dataService.get('api/products/getproduct/' + id);

    var dataSource = [];
    for (var i = 0; i < product.pictures.length; i++) {
      dataSource.push({
        url:
          constant.BASE_URL +
          'api/productimages/getimage/' +
          product.pictures[i].id,
      });
    }
    if (product.pictures.length == 0) {
      dataSource.push({
        url: 'http://www.daotao-vaas.org.vn/Images/noimage.gif',
      });
    }

    var category = await dataService.get(
      'api/productcategories/getproductcategory/' + product.categoryID,
    );

    this.setState({
      product: product,
      loading: false,
      email: email,
      user: user,
      category: category,
      dataSource: dataSource,
    });
  }

  async approveIconClick() {
    var data = {
      ...this.state.product,
      isApproved: true,
    };

    var result = await dataService.put(`api/products/update/${data.id}`, data);

    if (result.status == 200) {
      toastService.success('Approve promotion successfully!');
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack();
    } else {
      toastService.error('Error: ' + result.data);
    }
  }

  render() {
    const {loading, product, id, email, user, category, dataSource} =
      this.state;

    return (
      <Container style={styles.container}>
        <Header transparent>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
            <View>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Ionicon name="arrow-back-outline" color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <View>
              <Title style={styles.headerBodyText}>Product Detail</Title>
            </View>
            <View>
              <TouchableOpacity onPress={() => this.approveIconClick()}>
                <Icon
                  name="check"
                  color="white"
                  size={30}
                  style={styles.caretIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Header>
        {loading == false ? (
          <Content>
            <Slideshow dataSource={dataSource} />
            <Card style={{flex: 0, marginTop: 5}} transparent>
              {/* <CardItem style={styles.carditem}>
                <Body />
              </CardItem> */}
              <CardItem style={styles.carditem}>
                <Body>
                  <Text style={styles.title}>{product.productName}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.discount}>Price: {product.price} </Text>
                  <Text style={styles.normal}>
                    Category: {category.description}
                  </Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Left>
                  <Thumbnail
                    // source={require("../../icons/Avatar.png")}
                    defaultSource={{uri: 'avatar'}}
                    source={{
                      uri:
                        constant.BASE_URL +
                        'api/avatars/getimage/' +
                        product.createByEmail +
                        '?random_number=' +
                        new Date().getTime(),
                    }}
                  />
                </Left>
                <Body style={{marginLeft: -80}}>
                  <Text style={styles.normal}>Email:{product.email}</Text>
                  <Text style={styles.normal}>Phone:{product.phone}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.normal}>{product.description}</Text>
                </Body>
              </CardItem>
              <CardItem style={styles.carditem} bordered>
                <Body>
                  <Text style={styles.normal}>Location: {product.address}</Text>
                </Body>
              </CardItem>
              <CardItem style={{height: 60, backgroundColor: '#1F2426'}}>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <Text style={{color: 'white', padding: 3}}>Priority</Text>
                  <NumericInput
                    value={product.priority}
                    type="up-down"
                    totalWidth={80}
                    totalHeight={30}
                    textColor="white"
                    rightButtonBackgroundColor="#47BFB3"
                    iconSize={35}
                    onChange={value =>
                      this.setState({
                        promotion: {...product, priority: value},
                      })
                    }
                  />
                </View>
              </CardItem>
            </Card>
          </Content>
        ) : (
          <View>
            <Spinner color="red" />
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}>
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
    backgroundColor: '#1F2426',
  },
  carditem: {
    backgroundColor: '#1F2426',
  },
  headerBodyText: {
    justifyContent: 'center',
    //left: 30,
    fontSize: 20,
    marginTop: 5,
    color: '#47BFB3',
  },
  tabUnderLine: {
    display: 'none',
    backgroundColor: '#D94526',
  },
  tabHeading: {
    backgroundColor: '#D94526',
    // borderBottomWidth: 1,
    // borderBottomColor: "white"
  },
  tabs: {
    backgroundColor: '#D94526',
    borderWidth: 0,
  },
  title: {
    color: '#D94526',
    fontSize: 30,
    fontWeight: 'bold',
  },
  discount: {
    color: 'red',
    fontSize: 15,
  },
  normal: {
    color: 'white',
    fontSize: 15,
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});
