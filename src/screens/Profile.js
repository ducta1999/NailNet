import React, {Component} from 'react';
import {StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
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
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSelect from './Components/MultiSelect';
// import { TouchableOpacity } from "react-native-gesture-handler";
import * as dataService from '../services/DataService';
import * as toastService from '../services/ToastService';
import * as authentication from '../services/Authentication';
import * as constant from '../services/Constant';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Promotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      profile: [],
      edit: false,
      cities: [],
      selectedCity: [],

      firstName: '',
      lastName: '',
      phone: '',
      businessName: '',
      businessAddress: '',
      state: '',
      zipCode: '',
      businessSummary: '',

      avatarSource: [],
      options: {
        title: 'Select Avatar',
        //customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      buttonLoading: false,
      uri: [],
      uriValid: true,
    };
  }

  async componentWillMount() {
    var user = await authentication.getLoggedInUser();
    var profile = await dataService.get(
      'api/profiles/getprofilebyemail/' + user.email,
    );

    var cities = await dataService.getProvince();
    var itemCities = [{name: 'City', id: 0, children: []}];

    for (var j = 0; j < cities.length; j++) {
      itemCities[0].children.push({
        name: cities[j].name,
        id: cities[j].name,
      });
    }
    console.log(profile);

    this.setState({
      loading: false,
      profile: profile,
      cities: itemCities,
      selectedCity: [profile.city],
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      businessName: profile.businessName,
      businessAddress: profile.businessAddress,
      state: profile.state,
      zipCode: profile.zipCode,
      businessSummary: profile.businessSummary,
      uri:
        constant.BASE_URL +
        'api/avatars/getimage/' +
        profile.email +
        '?random_number=' +
        new Date().getTime(),
    });
  }

  editIconClick() {
    console.log('dsdss');
    this.refs.textInput.focus();
    this.setState({edit: true});
  }

  cancel() {
    const {profile} = this.state;
    this.setState({
      edit: false,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      businessName: profile.businessName,
      businessAddress: profile.businessAddress,
      state: profile.state,
      zipCode: profile.zipCode,
      businessSummary: profile.businessSummary,
      selectedCity: [profile.city],
    });
  }

  async submit() {
    const {
      profile,
      selectedCity,
      firstName,
      lastName,
      phone,
      businessName,
      businessAddress,
      state,
      zipCode,
      businessSummary,
      avatarSource,
      uriValid,
    } = this.state;

    var user = authentication.getLoggedInUser();
    this.setState({buttonLoading: true});

    if (selectedCity == null || selectedCity.length == 0) {
      toastService.error('Error: ' + 'Please choose your city!');

      this.setState({buttonLoading: false});
      return;
    }

    if (zipCode.length != 5) {
      toastService.error(
        'Error: ' + 'Please enter your zipcode with 5 characters!',
      );

      this.setState({buttonLoading: false});
      return;
    }

    var data = {
      ...profile,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      businessName: businessName,
      businessAddress: businessAddress,
      businessSummary: businessSummary,
      state: state,
      city: selectedCity[0],
      zipCode: zipCode,
    };

    if (avatarSource && avatarSource[0]) {
      var avatarData = {
        profileID: profile.id,
        createByEmail: profile.email,
      };
      if (uriValid == false) {
        var avatar = await dataService.post('api/avatars/add', avatarData);

        var res = await dataService.post(
          'api/avatars/upload/' + avatar.data.id,
          {
            extension: '.' + avatarSource[0].extension,
            base64: avatarSource[0].base64,
          },
        );
      } else {
        var res = await dataService.post(
          'api/avatars/uploadbyemail/' + profile.email,
          {
            extension: '.' + avatarSource[0].extension,
            base64: avatarSource[0].base64,
          },
        );
      }

      console.log(res);
    }

    var result = await dataService.put('api/profiles/update/' + data.id, data);

    if (result.status === 200) {
      toastService.success('Update profile successfully!');
      await authentication.updateAccountWithNewLocation(selectedCity[0]);
      this.setState({buttonLoading: false, edit: false});
    } else {
      this.setState({buttonLoading: false});
      toastService.error('Error: ' + result.data);
    }
  }

  async showImagePicker(options) {
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
    }).then(images => {
      if (images.length > 1) {
        toastService.error('Error: ' + 'You only can add 1 image');
        images = images.slice(0, 1);
        //  console.log(images);
      }

      var imageSources = [];
      for (var i = 0; i < images.length; i++) {
        var image = {
          source: images[i].path,
          base64: images[i].data,
          mime: images[i].mime,
          extension:
            images[i].mime == null ? 'png' : images[i].mime.split('/')[1],
        };
        imageSources.push(image);
      }

      this.setState({
        avatarSource: imageSources,
      });
    });
  }

  render() {
    const {
      loading,
      profile,
      edit,
      selectedCity,
      cities,
      buttonLoading,
      firstName,
      lastName,
      phone,
      businessName,
      businessAddress,
      state,
      zipCode,
      businessSummary,
      options,
      avatarSource,
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
                <Icon name="arrow-back-outline" color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <View>
              <Title style={styles.title}>PROFILE</Title>
            </View>
            <View>
              {edit == false ? (
                <TouchableOpacity onPress={() => this.editIconClick()}>
                  <Thumbnail
                    source={require('../icons/edit.png')}
                    style={styles.thumbnail}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.cancel()}>
                  <Icon name="arrow-back-outline" color="#fff" size={28} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Header>

        {loading == false ? (
          <Content>
            <TouchableOpacity
              onPress={() => edit && this.showImagePicker(options)}>
              <View style={styles.avatar}>
                {avatarSource && avatarSource[0] ? (
                  <Image
                    //source={item.source}
                    source={{
                      uri: `data:${avatarSource[0].mime};base64,${avatarSource[0].base64}`,
                    }}
                    style={styles.avatarThumbnail}
                    // style={{
                    //   width: 100,
                    //   height: 100,
                    //   resizeMode: "contain"
                    // }}
                  />
                ) : (
                  // <Thumbnail
                  //   large
                  //   source={require("../icons/Avatar.png")}
                  //   style={styles.avatarThumbnail}
                  // />
                  <Image
                    style={styles.avatarThumbnail}
                    source={{
                      uri: this.state.uri,
                    }}
                    disableCache={true}
                    onError={() =>
                      this.setState({
                        uri: 'avatar',
                        uriValid: false,
                      })
                    }
                  />
                )}
              </View>
            </TouchableOpacity>

            <Card transparent>
              <CardItem style={styles.carditem}>
                <Content>
                  <Form>
                    <Item style={styles.item}>
                      <Thumbnail
                        small
                        source={require('../icons/signupicon_name.png')}
                      />
                      <TextInput
                        editable={edit}
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
                        source={require('../icons/signupicon_name.png')}
                      />
                      <TextInput
                        editable={edit}
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
                        source={require('../icons/signupicon_phone.png')}
                      />
                      <TextInput
                        editable={edit}
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
                          source={require('../icons/signupicon_businessname.png')}
                        />
                        <TextInput
                          editable={edit}
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
                          source={require('../icons/signupicon_address.png')}
                        />
                        <TextInput
                          editable={edit}
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

                    <Item style={styles.item}>
                      <Thumbnail
                        small
                        source={require('../icons/signupicon_zipcode.png')}
                      />
                      <TextInput
                        editable={edit}
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
                        source={require('../icons/signupicon_state.png')}
                      />
                      <TextInput
                        editable={edit}
                        placeholder="Please enter your state..."
                        placeholderTextColor="#848484"
                        defaultValue={state}
                        onChangeText={text => this.setState({state: text})}
                        selectionColor="red"
                        style={styles.input}
                      />
                    </Item>

                    <View>
                      <View>
                        <Thumbnail
                          small
                          source={require('../icons/signupicon_city.png')}
                        />
                      </View>
                      <View
                        style={{
                          marginLeft: 55,
                          justifyContent: 'center',
                          marginTop: -50,
                        }}>
                        {loading == false && cities && (
                          <MultiSelect
                            items={cities}
                            placeHolder="Choose City..."
                            selectedItems={selectedCity}
                            setSelectedItems={value =>
                              edit == true &&
                              this.setState({selectedCity: value})
                            }
                          />
                        )}
                      </View>
                    </View>

                    {profile.occupationID != 1 && (
                      <Item style={styles.item}>
                        <Thumbnail
                          small
                          source={require('../icons/signupicon_address.png')}
                        />
                        <TextInput
                          editable={edit}
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
                  </Form>
                </Content>
              </CardItem>

              {edit == true && (
                <CardItem footer style={styles.buttonGroup}>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      onPress={() => this.cancel()}
                      style={styles.cancel}>
                      <Text style={styles.cancelText}>CANCEL</Text>
                    </TouchableOpacity>

                    <Button
                      backgroundColor="#47BFB3"
                      style={styles.submitButton}
                      onPress={() => this.submit()}>
                      {buttonLoading == true && <Spinner color="green" />}
                      <Text style={styles.submitButtonText}>SUBMIT</Text>
                    </Button>
                  </View>
                </CardItem>
              )}
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
    borderRadius: 150,
  },
  input: {
    color: 'white',
    marginLeft: 20,
    paddingRight: 20,
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

//multiselect style
const multiSelectStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  selectToggleText: {color: 'white'},
  button: {backgroundColor: '#D94526'},
  searchBar: {backgroundColor: '#1F2426'},
  searchTextInput: {color: '#D94526'},
});
const color = {
  text: '#D94526',
  subText: '#47BFB3',
  searchPlaceholderTextColor: '#D94526',
  itemBackground: '#1F2426',
  subItemBackground: '#1F2426',
};
