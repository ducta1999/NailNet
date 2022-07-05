import * as authentication from '../../services/Authentication';
import * as dataService from '../../services/DataService';
import * as constant from '../../services/Constant';
import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
  ScrollView,
} from 'react-native';
import Slideshow from 'react-native-image-slider-show';
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
  TabHeading,
} from 'native-base';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Loading from '../Components/Loading';
import moment from 'moment';

export default class PromotionDetail extends Component {
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

    var promotion = await dataService.get('api/promotions/getpromotion/' + id);

    var dataSource = [];
    for (var i = 0; i < promotion.pictures.length; i++) {
      // dataSource.push({
      //   url:
      //     constant.BASE_URL +
      //     'api/promotionpictures/getimage/' +
      //     promotion.pictures[i].id,
      // });
      dataSource.push({
        url: 'https://picsum.photos/2048',
      });
    }
    if (promotion.pictures.length == 0) {
      dataSource.push({
        url: 'http://www.daotao-vaas.org.vn/Images/noimage.gif',
      });
    }

    var category = await dataService.get(
      'api/promotioncategories/getpromotioncategory/' + promotion.categoryID,
    );

    this.setState({
      promotion: promotion,
      loading: false,
      email: email,
      user: user,
      category: category,
      dataSource: dataSource,
    });
  }

  render() {
    const {loading, promotion, id, email, user, category, dataSource} =
      this.state;
    const {width} = Dimensions.get('window');
    const renderItem = (title, value) => {
      return (
        <View style={{width: '50%', marginTop: 12}}>
          <Text style={styles.txtGray}>{title}</Text>
          <Text style={styles.txtTime}>{value}</Text>
        </View>
      );
    };

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
                <Ionicon name="close-outline" color="#000" size={28} />
              </TouchableOpacity>
            </View>

            <View />
          </View>
        </Header>
        {loading == false ? (
          <Content>
            <Slideshow
              dataSource={dataSource}
              arrowSize={24}
              arrowLeft={
                <Ionicon name="chevron-back-outline" color="#fff" size={24} />
              }
              arrowRight={
                <Ionicon
                  name="chevron-forward-outline"
                  color="#fff"
                  size={24}
                />
              }
            />
            <ScrollView style={{paddingBottom: 68}}>
              <View style={styles.body}>
                <Text style={styles.title}>{promotion.title}</Text>
                <View style={styles.row}>
                  {renderItem(
                    'From',
                    moment(promotion.fromDate, 'DD/MM/yyyy').format('LL'),
                  )}
                  {renderItem(
                    'To',
                    moment(promotion.toDate, 'DD/MM/yyyy').format('LL'),
                  )}
                </View>
                <View style={styles.row}>
                  {renderItem('Discount', `${promotion.discount}%`)}
                  {renderItem('Category', category.description)}
                </View>

                <View style={styles.row}>
                  {renderItem('Email', promotion.email)}
                  {renderItem(
                    'Phone',
                    promotion.phone.replace(
                      /(\d{3})(\d{3})(\d{4})/,
                      '($1) $2-$3',
                    ),
                  )}
                </View>
                <View style={styles.row}>
                  {renderItem('Location', promotion.location)}
                </View>
                <Text
                  style={[styles.txtGray, {color: '#343a40', marginTop: 24}]}>
                  Description
                </Text>
                <Text style={[styles.txtTime, {color: '#6c757d'}]}>
                  {promotion.description}
                </Text>
              </View>
            </ScrollView>
          </Content>
        ) : (
          <Loading />
        )}
        <View
          style={[
            styles.row,
            {
              padding: 24,
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: width,
              backgroundColor: '#184e77',
            },
          ]}>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${promotion.phone}`)}
            style={styles.row}>
            <Ionicon name="call-outline" color="#fff" size={24} />
            <Text style={styles.btnTxt}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(`sms:${promotion.phone}`)}
            style={styles.row}>
            <Ionicon name="send-outline" color="#fff" size={24} />
            <Text style={styles.btnTxt}>SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Chat', {
                senderEmail: email,
                receiverEmail: promotion.createByEmail,
              })
            }
            style={styles.row}>
            <Ionicon name="chatbox-ellipses-outline" color="#fff" size={24} />
            <Text style={styles.btnTxt}>Chat</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#000',
    fontSize: 22,
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  discount: {
    color: 'red',
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
  },
  normal: {
    color: '#000',
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
  },
  body: {
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtGray: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#6c757d',
    fontSize: 12.68,
  },
  txtTime: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#000',
    fontSize: 16,
    marginTop: 2,
  },
  btnTxt: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
    fontSize: 14,
    marginLeft: 9,
  },
});
