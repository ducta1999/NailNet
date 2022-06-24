import React, {Component} from 'react';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {
  Container,
  Header,
  View,
  Thumbnail,
  Content,
  Title,
  Item,
  Text,
  Spinner,
  Input,
  CardItem,
  Card,
  Button,
  Form,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from '../../services/DataService';
import * as toastService from '../../services/ToastService';
import * as authentication from '../../services/Authentication';
import * as constant from '../../services/Constant';

export default class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      profile: [],
      edit: false,
      city: '',

      firstName: '',
      lastName: '',
      phone: '',
      businessName: '',
      businessAddress: '',
      state: '',
      zipCode: '',
      businessSummary: '',

      buttonLoading: false,
    };
    this.approveIconClick = this.approveIconClick.bind(this);
  }

  async componentWillMount() {
    var profile = await dataService.get(
      'api/profiles/getprofile/' + this.props.navigation.state.params.id,
    );

    this.setState({
      loading: false,
      profile: profile,
      city: profile.city,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      businessName: profile.businessName,
      businessAddress: profile.businessAddress,
      state: profile.state,
      zipCode: profile.zipCode,
      businessSummary: profile.businessSummary,
    });
  }

  async approveIconClick() {
    var data = {
      ...this.state.profile,
      isApproved: true,
    };

    var result = await dataService.put(`api/profiles/update/${data.id}`, data);

    if (result.status == 200) {
      toastService.success('Approve profile successfully!');
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack();
    } else {
      toastService.error('Error: ' + result.data);
    }
  }

  render() {
    const {
      loading,
      profile,
      edit,
      city,
      buttonLoading,
      firstName,
      lastName,
      phone,
      businessName,
      businessAddress,
      state,
      zipCode,
      businessSummary,
    } = this.state;
    return (
      <Container style={styles.container}>
        <Header hasTabs transparent>
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
              <Title style={styles.title}>USER DETAIL</Title>
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
            <View style={styles.avatar}>
              <Thumbnail
                large
                //source={require("../../icons/Avatar.png")}
                defaultSource={{uri: 'avatar'}}
                source={{
                  uri:
                    constant.BASE_URL +
                    'api/avatars/getimage/' +
                    profile.email +
                    '?random_number=' +
                    new Date().getTime(),
                }}
                style={styles.avatarThumbnail}
              />
            </View>

            <Card transparent>
              <CardItem style={styles.carditem}>
                <Content>
                  <Form>
                    <Item style={styles.item}>
                      <Thumbnail
                        small
                        source={require('../../icons/signupicon_name.png')}
                      />
                      <TextInput
                        editable={false}
                        placeholder="Please enter your first name..."
                        placeholderTextColor="#848484"
                        defaultValue={firstName}
                        onChangeText={text => this.setState({firstName: text})}
                        ref={'textInput'}
                        selectionColor="red"
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item}>
                      <Thumbnail
                        small
                        source={require('../../icons/signupicon_name.png')}
                      />
                      <TextInput
                        editable={false}
                        placeholder="Please enter your last name..."
                        placeholderTextColor="#848484"
                        defaultValue={lastName}
                        onChangeText={text => this.setState({lastName: text})}
                        selectionColor="red"
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item}>
                      <Thumbnail
                        small
                        source={require('../../icons/signupicon_phone.png')}
                      />
                      <TextInput
                        editable={false}
                        placeholder="Please enter your phone number..."
                        placeholderTextColor="#848484"
                        defaultValue={phone}
                        onChangeText={text => this.setState({phone: text})}
                        selectionColor="red"
                        style={styles.input}
                      />
                    </Item>

                    {profile.occupationID != 1 && (
                      <Item style={styles.item}>
                        <Thumbnail
                          small
                          source={require('../../icons/signupicon_businessname.png')}
                        />
                        <TextInput
                          editable={false}
                          placeholder="Please enter your business name..."
                          placeholderTextColor="#848484"
                          defaultValue={businessName}
                          onChangeText={text =>
                            this.setState({businessName: text})
                          }
                          selectionColor="red"
                          style={styles.input}
                        />
                      </Item>
                    )}

                    {profile.occupationID != 1 && (
                      <Item style={styles.item}>
                        <Thumbnail
                          small
                          source={require('../../icons/signupicon_address.png')}
                        />
                        <TextInput
                          editable={false}
                          placeholder="Please enter your business address..."
                          placeholderTextColor="#848484"
                          defaultValue={businessAddress}
                          onChangeText={text =>
                            this.setState({businessAddress: text})
                          }
                          multiline={true}
                          selectionColor="red"
                          style={styles.input}
                        />
                      </Item>
                    )}

                    {profile.occupationID != 1 && (
                      <Item style={styles.item}>
                        <Thumbnail
                          small
                          source={require('../../icons/signupicon_address.png')}
                        />
                        <TextInput
                          editable={false}
                          placeholder="Please enter your business summary..."
                          placeholderTextColor="#848484"
                          defaultValue={businessSummary}
                          onChangeText={text =>
                            this.setState({businessSummary: text})
                          }
                          multiline={true}
                          selectionColor="red"
                          style={styles.input}
                        />
                      </Item>
                    )}

                    <Item style={styles.item}>
                      <Thumbnail
                        small
                        source={require('../../icons/signupicon_zipcode.png')}
                      />
                      <TextInput
                        editable={false}
                        placeholder="Please enter your zipcode..."
                        placeholderTextColor="#848484"
                        defaultValue={zipCode}
                        maxLength={5}
                        keyboardType="numeric"
                        onChangeText={text => this.setState({zipCode: text})}
                        selectionColor="red"
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item}>
                      <Thumbnail
                        small
                        source={require('../../icons/signupicon_state.png')}
                      />
                      <TextInput
                        editable={false}
                        placeholder="Please enter your state..."
                        placeholderTextColor="#848484"
                        defaultValue={state}
                        onChangeText={text => this.setState({state: text})}
                        selectionColor="red"
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item}>
                      <Thumbnail
                        small
                        source={require('../../icons/signupicon_state.png')}
                      />
                      <TextInput
                        editable={false}
                        placeholder="Please enter your city..."
                        placeholderTextColor="#848484"
                        defaultValue={city}
                        onChangeText={text => this.setState({city: text})}
                        selectionColor="red"
                        style={styles.input}
                      />
                    </Item>
                  </Form>
                </Content>
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
  avatar: {
    alignItems: 'center',
  },
  title: {
    color: '#47BFB3',
    // marginLeft: 100,
    fontSize: 20,
    marginTop: 5,
  },
  //icon: { fontSize: 40 },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
  avatarThumbnail: {
    width: 150,
    height: 150,
  },
  input: {
    color: 'white',
    marginLeft: 20,
  },
  item: {
    marginBottom: 20,
    left: -12,
    borderColor: 'transparent',
  },
  carditem: {
    backgroundColor: '#1F2426',
  },
  buttonGroup: {
    backgroundColor: '#1F2426',
  },
  cardFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancel: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "flex-start",
    marginLeft: 15,
    marginTop: 10,
  },
  submitButton: {
    width: 150,
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
