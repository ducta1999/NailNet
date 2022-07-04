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
  Body,
  Spinner,
} from 'native-base';
import * as dataSetvice from '../services/DataService';
import * as toastService from '../services/ToastService';
import Icon from 'react-native-vector-icons/Ionicons';
import * as tinh_tp from '../json/tinh_tp.json';
import LottieView from 'lottie-react-native';
import MultiSelect from './Components/MultiSelect';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Loading from './Components/Loading';

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
      currentIndex: 0,
      paginationData: [
        {title: 'Occupation', isCompleted: false},
        {title: 'Address', isCompleted: false},
        {title: 'Account', isCompleted: false},
        {title: 'Password', isCompleted: false},
      ],
      success: false,
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
        this.setState({
          success: true,
        });

        this.setState({buttonLoading: false});
        setTimeout(() => {
          this.props.navigation.goBack();
          this.setState({
            success: false,
          });
          toastService.success('Add profile successfully!');
        }, 999);
      } else {
        this.setState({buttonLoading: false});
        if (result.data.includes('Email')) {
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
    const {width} = Dimensions.get('window');

    const dataCarousel = [
      {
        key: 'occupation',
        view: (
          <>
            <Text style={styles.subTitle}>Choose Your Occupation</Text>
            <View style={{marginBottom: 9}}>
              {this.state.loading == false && (
                <MultiSelect
                  backgroundColor="#0065ff"
                  items={this.state.occupations}
                  placeHolder="Choose Occupation"
                  selectedItems={this.state.selectedOccupation}
                  setSelectedItems={value => {
                    this.setState({
                      selectedOccupation: value,
                      paginationData: [
                        {title: 'Occupation', isCompleted: true},
                        ...this.state.paginationData.slice(1),
                      ],
                    });
                  }}
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
                      this.setState({
                        selectedIndustry: value,
                      })
                    }
                  />
                )}
              </View>
            )}
            <Button
              block
              backgroundColor="#212121"
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
            <Text style={styles.subTitle}>Choose your address</Text>
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
                    this.setState({
                      selectedCity: value,
                      paginationData: [
                        ...this.state.paginationData.slice(0, 1),
                        {title: 'Address', isCompleted: true},
                        ...this.state.paginationData.slice(2),
                      ],
                    })
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
                backgroundColor="#212121"
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
            <Text style={styles.subTitle}>Enter account details</Text>
            <View style={styles.item}>
              <Icon
                name="mail-open"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                placeholder="Email / Username"
                placeholderTextColor="#6c757d"
                onChangeText={text => {
                  this.setState({
                    email: text,
                    paginationData: [
                      ...this.state.paginationData.slice(0, 2),
                      {title: 'Account', isCompleted: text.trim() !== ''},
                      ...this.state.paginationData.slice(3),
                    ],
                  });
                }}
                style={styles.input}
              />
            </View>
            <View style={styles.item}>
              <Icon
                name="person"
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
                name="person"
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
                backgroundColor="#212121"
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
            <Text style={styles.subTitle}>Enter your password</Text>
            <View style={styles.item}>
              <Icon
                name="lock-closed"
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
                onChangeText={text => {
                  this.setState({
                    password: text.replace(/[^0-9]/g, ''),
                    paginationData: [
                      ...this.state.paginationData.slice(0, 3),
                      {
                        title: 'Password',
                        isCompleted:
                          text.trim() !== '' &&
                          text === this.state.passwordConfirm,
                      },
                    ],
                  });
                }}
                style={styles.input}
              />
            </View>

            <View style={styles.item}>
              <Icon
                name="lock-closed"
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
                onChangeText={text => {
                  this.setState({
                    passwordConfirm: text.replace(/[^0-9]/g, ''),
                    paginationData: [
                      ...this.state.paginationData.slice(0, 3),
                      {
                        title: 'Password',
                        isCompleted:
                          text.trim() !== '' && text === this.state.password,
                      },
                    ],
                  });
                }}
                style={styles.input}
              />
            </View>
            <Text
              style={[
                styles.errorTxt,
                {
                  opacity:
                    this.state.password.trim() !== '' &&
                    this.state.passwordConfirm.trim() !== '' &&
                    this.state.password !== this.state.passwordConfirm
                      ? 1
                      : 0,
                },
              ]}>
              Password and confirm password doesn't match.
            </Text>
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
                backgroundColor="#0466c8"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.submit()}>
                {this.state.buttonLoading ? (
                  <View style={{height: 99, width: 99}}>
                    <LottieView
                      source={require('../json/dotLoading.json')}
                      autoPlay
                    />
                  </View>
                ) : this.state.success === true ? (
                  <View style={{height: 99, width: 99}}>
                    <LottieView
                      speed={2.5}
                      source={require('../json/success.json')}
                      autoPlay
                    />
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </Button>
            </View>
          </>
        ),
      },
    ];

    return (
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 28,
            paddingHorizontal: 10,
          }}>
          <Text style={styles.title}>Sign up</Text>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="close-outline" color="#01161e" size={36} />
          </TouchableOpacity>
        </View>
        <View style={styles.pagination}>
          {this.state.paginationData.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.79}
              key={`pagination ${index}`}
              onPress={() => this.swapSlide.snapToItem(index)}
              style={{width: '22%', marginBottom: 36}}>
              <Text
                style={[
                  styles.progressTitle,
                  {
                    color:
                      index === this.state.currentIndex
                        ? '#1db25b'
                        : item.isCompleted
                        ? '#686868'
                        : '#cacaca',
                  },
                ]}>
                {item.title}
              </Text>
              <View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor:
                      index === this.state.currentIndex || item.isCompleted
                        ? '#1db25b'
                        : '#cacaca',
                  },
                ]}></View>
            </TouchableOpacity>
          ))}
        </View>
        {this.state.loading == false ? (
          <View style={styles.carditem}>
            <Carousel
              ref={value => (this.swapSlide = value)}
              data={dataCarousel}
              renderItem={({item}) => item.view}
              sliderWidth={width - 68}
              itemWidth={width - 68}
              onSnapToItem={index => this.setState({currentIndex: index})}
            />
            <Text style={styles.signupText}>
              Joined us before?{'  '}
              <Text
                style={[
                  styles.signupText,
                  {
                    color: '#184e77',
                    fontFamily: 'Montserrat-Bold',
                  },
                ]}
                onPress={() => this.props.navigation.goBack()}>
                Login
              </Text>
            </Text>
          </View>
        ) : (
          <Loading />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  pagination: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    justifyContent: 'space-between',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingVertical: 24,
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
    fontFamily: 'Montserrat-SemiBold',
    color: '#01161e',
    fontSize: 28,
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
    color: '#000',
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
  progressBar: {
    backgroundColor: '#cacaca',
    height: 3,
    width: '100%',
    borderRadius: 24,
  },
  progressTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    marginBottom: 9,
    textAlign: 'center',
    color: '#cacaca',
  },
  errorTxt: {
    color: '#e71d36',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 11,
    marginVertical: 9,
  },
  subTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#000814',
    marginTop: 9,
    marginBottom: 19,
    textTransform: 'capitalize',
  },
  signupText: {
    color: '#6c757d',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
});
