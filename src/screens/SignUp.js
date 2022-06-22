import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
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
  Spinner,
} from 'native-base';
import * as dataSetvice from '../services/DataService';
import * as toastService from '../services/ToastService';
import Icon from 'react-native-vector-icons/Ionicons';
import * as tinh_tp from '../json/tinh_tp.json';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import LottieView from 'lottie-react-native';
import MultiSelect from './Components/MultiSelect';
import Carousel from 'react-native-snap-carousel';

export default class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      buttonLoading: false,
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      passwordConfirm: '',
      businessName: '',
      businessAddress: '',
      state: '',
      zipCode: '',
      businessSummary: '',
      isPro: [],
      occupations: [],
      selectedOccupation: [],
      industries: [],
      selectedIndustry: [],
      selectedIndustryIds: [],
      selectedIndustryText: '',
      cities: [],
      states: [],
      selectedCity: [],
      selectedState: [],
    };

    this.ensureDataFetched = this.ensureDataFetched.bind(this);
  }

  componentDidMount() {
    this.ensureDataFetched();
  }

  async ensureDataFetched() {
    try {
      var occupations = await dataSetvice.get('api/occupations/getall');
      occupations.items = occupations.items.reverse();
      var itemoOcupations = [{name: 'Occupation', id: 0, children: []}];

      for (var j = 0; j < occupations.items.length; j++) {
        itemoOcupations[0].children.push({
          name: occupations.items[j].description,
          id: occupations.items[j].id,
        });
      }

      var industries = await dataSetvice.get('api/faqindustries/getall');
      var itemIndustries = [{name: 'Industry', id: 0, children: []}];

      for (var j = 0; j < industries.items.length; j++) {
        itemIndustries[0].children.push({
          name: industries.items[j].description,
          id: industries.items[j].id,
        });
      }

      // var cities = await dataSetvice.getOnlineData(
      //   "https://thongtindoanhnghiep.co/api/city"
      // );

      var cities = await dataSetvice.getProvince();
      var itemCities = [{name: 'City', id: 0, children: []}];

      for (var j = 0; j < cities.length; j++) {
        itemCities[0].children.push({
          name: cities[j].name,
          id: cities[j].name,
        });
      }

      var states = await dataSetvice.getState();

      var itemStates = [{name: 'State', id: 0, children: []}];

      for (var j = 0; j < states.length; j++) {
        itemStates[0].children.push({
          name: states[j].name,
          id: states[j].name,
        });
      }

      this.setState({
        occupations: itemoOcupations,
        loading: false,
        industries: itemIndustries,
        // selectedIndustry: null,
        cities: itemCities,
        states: itemStates,
        // selectedOccupation: occupations.items[0].id
      });

      // pickerIndustryChange(value) {
      //   this.setState({ selectedIndustry: value });
      //   if (value == null) {
      //     this.setState({ selectedIndustryText: "", selectedIndustryIds: [] });
      //   } else {
      //     var selectedIndustryText = this.state.selectedIndustryText;

      //     var industry = this.state.industries.items.find(i => i.id == value);
      //     selectedIndustryText += industry.description + "  ";

      //     if (this.state.selectedIndustryIds.indexOf(value) > -1) {
      //       //this.setState({ selectedIndustryText: selectedIndustryText });
      //     } else {
      //       this.setState({
      //         selectedIndustryText: selectedIndustryText,
      //         selectedIndustryIds: this.state.selectedIndustryIds.concat([value])
      //       });
      //     }
      //   }
    } catch (error) {
      Alert.alert('API Get Error', error.message, [
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
      ]);
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  async submit() {
    try {
      this.setState({buttonLoading: true});
      const {
        firstName,
        lastName,
        phone = '',
        email,
        password,
        passwordConfirm,
        businessName = '',
        businessAddress = '',
        state,
        zipCode = '',
        businessSummary,
        selectedOccupation,
        selectedIndustry,
        selectedCity,
        selectedState,
        selectedIndustryIds,
      } = this.state;

      if (email.trim() == '') {
        toastService.error('Error: ' + 'Email cannot be empty!');
        this.swapSlide.snapToItem(2);
        this.setState({buttonLoading: false});
        return;
      }

      if (selectedCity == null || selectedCity.length == 0) {
        toastService.error('Error: ' + 'Please choose your city!');
        this.swapSlide.snapToItem(1);
        this.setState({buttonLoading: false});
        return;
      }

      // if (selectedState == null || selectedState.length == 0) {
      //   toastService.error('Error: ' + 'Please choose your state!');

      //   this.setState({buttonLoading: false});
      //   return;
      // }

      if (selectedOccupation == null || selectedOccupation.length == 0) {
        toastService.error('Error: ' + 'Please choose your occupation!');
        this.swapSlide.snapToItem(0);
        this.setState({buttonLoading: false});
        return;
      }

      if (password.trim() == '') {
        toastService.error('Error: ' + 'Password cannot be empty!');

        this.setState({buttonLoading: false});
        return;
      }

      if (password != passwordConfirm) {
        toastService.error(
          'Error: ' + 'Password and confirm password must match',
        );

        this.setState({buttonLoading: false});
        return;
      }

      var data = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        password: password,
        businessName: businessName,
        businessAddress: businessAddress,
        state: selectedState[0] ? selectedState[0] : 'GV',
        city: selectedCity[0],
        zipCode: zipCode,
        businessSummary: businessSummary,
        occupationID: selectedOccupation[0],
        isPro: selectedOccupation[0] == 3 ? true : false,
        isApproved: selectedOccupation[0] == 1 ? true : false,
      };

      var result = await dataSetvice.post('api/profiles/add', data);

      if (result.status === 200) {
        var profileId = result.data.id;

        if (selectedOccupation[0] == 3) {
          for (var i = 0; i < selectedIndustry.length; i++) {
            var profileIndustry = {
              profileID: profileId,
              industryID: selectedIndustry[i],
            };
            await dataSetvice.post(
              'api/profileindustries/add',
              profileIndustry,
            );
          }
        }

        toastService.success('Add profile successfully!');

        this.setState({buttonLoading: false});
        this.props.navigation.goBack();
      } else {
        console.log(result);
        this.setState({buttonLoading: false});
        if (result.data.includes('Email already exists')) {
          this.swapSlide.snapToItem(2);
        }
        toastService.error('Error: ' + result.data);
      }
    } catch (error) {
      Alert.alert('API Get Error', error.message, [
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
      ]);
    } finally {
      this.setState({buttonLoading: false});
    }
  }

  swapSlide = value => {
    this.setState({carousel: value});
  };

  render() {
    const {width, height} = Dimensions.get('window');

    const dataCarousel = [
      {
        key: 'occupation',
        view: (
          <>
            <View style={{marginBottom: 9}}>
              {this.state.loading == false && (
                <MultiSelect
                  backgroundColor="#0065ff"
                  items={this.state.occupations}
                  placeHolder="Choose Occupation"
                  selectedItems={this.state.selectedOccupation}
                  setSelectedItems={value =>
                    this.setState({selectedOccupation: value})
                  }
                />
              )}
            </View>

            {this.state.selectedOccupation[0] == 3 && (
              <View style={{marginBottom: 9}}>
                {this.state.loading == false && (
                  <MultiSelect
                    items={this.state.industries}
                    placeHolder="Choose Industry"
                    selectedItems={this.state.selectedIndustry}
                    setSelectedItems={value =>
                      this.setState({selectedIndustry: value})
                    }
                  />
                )}
              </View>
            )}
            <Button
              block
              backgroundColor="#168aad"
              style={styles.submitButton}
              onPress={() => this.swapSlide.snapToNext()}>
              <Text style={styles.submitButtonText}>Continue</Text>
            </Button>
          </>
        ),
      },
      {
        key: 'address',
        view: (
          <>
            <View style={{marginBottom: 9}}>
              {this.state.loading == false && (
                <MultiSelect
                  items={this.state.states}
                  placeHolder="Choose State"
                  selectedItems={this.state.selectedState}
                  setSelectedItems={value =>
                    this.setState({selectedState: value})
                  }
                />
              )}
            </View>

            <View style={{marginBottom: 9}}>
              {this.state.loading == false && this.state.cities && (
                <MultiSelect
                  items={this.state.cities}
                  placeHolder="Choose City"
                  selectedItems={this.state.selectedCity}
                  setSelectedItems={value =>
                    this.setState({selectedCity: value})
                  }
                />
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Button
                block
                backgroundColor="#4c5c68"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.swapSlide.snapToPrev()}>
                <Icon name="arrow-back-circle-outline" color="#fff" size={28} />
              </Button>
              <Button
                block
                backgroundColor="#168aad"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.swapSlide.snapToNext()}>
                <Text style={styles.submitButtonText}>Continue</Text>
              </Button>
            </View>
          </>
        ),
      },

      {
        key: 'email',
        view: (
          <>
            <View style={styles.item}>
              <Icon
                name="mail-open-outline"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                placeholder="Email"
                placeholderTextColor="#6c757d"
                onChangeText={text => this.setState({email: text})}
                style={styles.input}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Button
                block
                backgroundColor="#4c5c68"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.swapSlide.snapToPrev()}>
                <Icon name="arrow-back-circle-outline" color="#fff" size={28} />
              </Button>
              <Button
                block
                backgroundColor="#168aad"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.swapSlide.snapToNext()}>
                <Text style={styles.submitButtonText}>Continue</Text>
              </Button>
            </View>
          </>
        ),
      },
      {
        key: 'user',
        view: (
          <>
            <View style={styles.item}>
              <Icon
                name="person-outline"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                placeholder="First name"
                placeholderTextColor="#6c757d"
                onChangeText={text => this.setState({firstName: text})}
                style={styles.input}
              />
            </View>

            <View style={styles.item}>
              <Icon
                name="person-outline"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                placeholder="Last name"
                placeholderTextColor="#6c757d"
                onChangeText={text => this.setState({lastName: text})}
                style={styles.input}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Button
                block
                backgroundColor="#4c5c68"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.swapSlide.snapToPrev()}>
                <Icon name="arrow-back-circle-outline" color="#fff" size={28} />
              </Button>
              <Button
                block
                backgroundColor="#168aad"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.swapSlide.snapToNext()}>
                <Text style={styles.submitButtonText}>Continue</Text>
              </Button>
            </View>
          </>
        ),
      },
      {
        key: 'password',
        view: (
          <>
            <View style={styles.item}>
              <Icon
                name="lock-closed-outline"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                placeholder="6 Digits Password"
                placeholderTextColor="#6c757d"
                secureTextEntry={true}
                keyboardType="numeric"
                maxLength={6}
                value={this.state.password}
                onChangeText={text =>
                  this.setState({
                    password: text.replace(/[^0-9]/g, ''),
                  })
                }
                style={styles.input}
              />
            </View>

            <View style={styles.item}>
              <Icon
                name="lock-closed-outline"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                placeholder="Confirm Password"
                placeholderTextColor="#6c757d"
                secureTextEntry={true}
                maxLength={6}
                keyboardType="numeric"
                value={this.state.passwordConfirm}
                onChangeText={text =>
                  this.setState({
                    passwordConfirm: text.replace(/[^0-9]/g, ''),
                  })
                }
                style={styles.input}
              />
            </View>
            <Text style={styles.signupText}>
              By signing up, you're agree to our{' '}
              <Text
                onPress={() =>
                  Linking.openURL('https://privacy.enrichcous.com/')
                }
                style={styles.linkText}>
                Privacy Policy
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Button
                block
                backgroundColor="#4c5c68"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.swapSlide.snapToPrev()}>
                <Icon name="arrow-back-circle-outline" color="#fff" size={28} />
              </Button>
              <Button
                block
                backgroundColor="#06d6a0"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.submit()}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </Button>
            </View>
          </>
        ),
      },
    ];

    return (
      <Container style={styles.container}>
        <Content>
          {this.state.loading == false ? (
            <View>
              <View style={styles.logoView}>
                <LottieView
                  source={require('../json/collab.json')}
                  autoPlay
                  loop
                />
              </View>
              <Card transparent>
                <CardItem style={styles.carditem}>
                  <Content>
                    <Text style={styles.title}>Sign up</Text>
                    <Carousel
                      scrollEnabled={false}
                      ref={value => (this.swapSlide = value)}
                      data={dataCarousel}
                      renderItem={({item}) => item.view}
                      sliderWidth={width - 68}
                      itemWidth={width - 68}
                    />
                  </Content>
                </CardItem>

                <CardItem footer style={styles.buttonGroup}>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                      style={styles.cancel}>
                      <Text style={styles.cancelText}>CANCEL</Text>
                    </TouchableOpacity>
                  </View>
                </CardItem>
              </Card>
            </View>
          ) : (
            <View
              style={{
                height: height,
                width: '100%',
                justifyContent: 'center',
              }}>
              <View style={{height: 111}}>
                <LottieView
                  source={require('../json/loading.json')}
                  autoPlay
                  loop
                />
              </View>
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  cardFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  caretIcon: {
    right: 25,
  },
  carditem: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#fff',
    color: '#343a40',
    borderBottomWidth: 1.1,
    borderColor: 'rgba(108, 117, 125, 0.5)',
  },
  item: {
    marginBottom: 20,
    marginLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 19,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    color: '#212529',
    marginBottom: 24,
    fontSize: 30,
    letterSpacing: -1,
  },

  logoView: {
    flex: 1,
    height: 268,
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
    marginTop: 20,
  },
  submitButton: {
    borderRadius: 9,
    marginTop: 15,
  },
  submitButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    textTransform: 'capitalize',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  cancel: {
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "flex-start",
    marginLeft: 15,
    marginTop: 10,
  },
  buttonGroup: {
    backgroundColor: '#fff',
  },
  signupText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBoldItalic',
    color: '#46494c',
    marginVertical: 9,
  },
  linkText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: '#0065ff',
  },
});
