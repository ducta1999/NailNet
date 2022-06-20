import React, {Component} from 'react';
import {Alert, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import * as tinh_tp from '../json/tinh_tp.json';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import LottieView from 'lottie-react-native';

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
        phone,
        email,
        password,
        passwordConfirm,
        businessName,
        businessAddress,
        state,
        zipCode,
        businessSummary,
        selectedOccupation,
        selectedIndustry,
        selectedCity,
        selectedState,
        selectedIndustryIds,
      } = this.state;

      if (email.trim() == '') {
        toastService.error('Error: ' + 'Email cannot be empty!');

        this.setState({buttonLoading: false});
        return;
      }

      if (selectedCity == null || selectedCity.length == 0) {
        toastService.error('Error: ' + 'Please choose your city!');

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

      console.log(selectedCity);

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

  render() {
    const {width, height} = Dimensions.get('window');

    return (
      <Container style={styles.container}>
        <Content>
          {this.state.loading == false ? (
            <View>
              <View style={styles.logoView}>
                <Thumbnail
                  square
                  large
                  source={require('../icons/nailtalkpro.png')}
                  style={styles.logo}
                />
              </View>

              <View style={styles.titleView}>
                <Text style={styles.titleText}>SIGN UP</Text>
              </View>

              <Card transparent>
                <CardItem style={styles.carditem}>
                  <Content>
                    <Form>
                      <View style={{paddingLeft: 16}}>
                        <View>
                          <Thumbnail
                            small
                            source={require('../icons/signupicon_nail.png')}
                          />
                        </View>
                        <View
                          style={{
                            marginLeft: 39,
                            justifyContent: 'center',
                            marginTop: -45,
                          }}>
                          {this.state.loading == false && (
                            <SectionedMultiSelect
                              items={this.state.occupations}
                              uniqueKey="id"
                              subKey="children"
                              expandDropDowns={true}
                              selectText="Choose Occupation..."
                              showDropDowns={true}
                              readOnlyHeadings={true}
                              onSelectedItemsChange={value =>
                                this.setState({selectedOccupation: value})
                              }
                              selectedItems={this.state.selectedOccupation}
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
                                  style={{marginLeft: 15}}
                                />
                              }
                              colors={color}
                              styles={multiSelectStyles}
                            />
                          )}
                        </View>
                      </View>

                      {this.state.selectedOccupation[0] == 3 && (
                        <View>
                          <View>
                            <Thumbnail
                              small
                              source={require('../icons/signupicon_nail.png')}
                            />
                          </View>
                          <View
                            style={{
                              marginLeft: 55,
                              justifyContent: 'center',
                              marginTop: -45,
                            }}>
                            {this.state.loading == false && (
                              <SectionedMultiSelect
                                items={this.state.industries}
                                uniqueKey="id"
                                subKey="children"
                                expandDropDowns={true}
                                selectText="Choose Industry..."
                                showDropDowns={true}
                                readOnlyHeadings={true}
                                onSelectedItemsChange={value =>
                                  this.setState({selectedIndustry: value})
                                }
                                selectedItems={this.state.selectedIndustry}
                                single={false}
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
                                    style={{marginLeft: 15}}
                                  />
                                }
                                colors={color}
                                styles={multiSelectStyles}
                              />
                            )}
                          </View>
                        </View>
                      )}
                      {/* 
                  {this.state.selectedIndustryText != "" && (
                    <View style={{ alignItems: "center" }}>
                      <Text style={styles.input}>
                        {this.state.selectedIndustryText}
                      </Text>
                    </View>
                  )} */}

                      <Item style={styles.item}>
                        <Input
                          placeholder="First name..."
                          placeholderTextColor="#f1faee"
                          onChangeText={text =>
                            this.setState({firstName: text})
                          }
                          style={styles.input}
                        />
                      </Item>

                      <Item style={styles.item}>
                        <Input
                          placeholder="Last name..."
                          placeholderTextColor="#f1faee"
                          onChangeText={text => this.setState({lastName: text})}
                          style={styles.input}
                        />
                      </Item>

                      <Item style={styles.item}>
                        <Input
                          placeholder="Email..."
                          placeholderTextColor="#f1faee"
                          onChangeText={text => this.setState({email: text})}
                          style={styles.input}
                        />
                      </Item>

                      <Item style={styles.item}>
                        <Input
                          keyboardType="number-pad"
                          placeholder="Phone number..."
                          placeholderTextColor="#f1faee"
                          onChangeText={text => this.setState({phone: text})}
                          style={styles.input}
                        />
                      </Item>

                      {this.state.selectedOccupation[0] != 1 && (
                        <View style={{marginLeft: 15}}>
                          <Item style={styles.item}>
                            <Input
                              placeholder="Business name..."
                              placeholderTextColor="#f1faee"
                              onChangeText={text =>
                                this.setState({businessName: text})
                              }
                              style={styles.input}
                            />
                          </Item>

                          <Item style={styles.item}>
                            <Input
                              placeholder="Business address..."
                              placeholderTextColor="#f1faee"
                              onChangeText={text =>
                                this.setState({businessAddress: text})
                              }
                              style={styles.input}
                            />
                          </Item>
                        </View>
                      )}

                      <Item style={styles.item}>
                        <Input
                          placeholder="Zipcode..."
                          placeholderTextColor="#f1faee"
                          onChangeText={text => this.setState({zipCode: text})}
                          style={styles.input}
                        />
                      </Item>

                      <View style={{paddingLeft: 16}}>
                        <View>
                          <Thumbnail
                            small
                            source={require('../icons/signupicon_state.png')}
                          />
                        </View>
                        <View
                          style={{
                            marginLeft: 39,
                            justifyContent: 'center',
                            marginTop: -50,
                          }}>
                          {this.state.loading == false && this.state.states && (
                            <SectionedMultiSelect
                              items={this.state.states}
                              uniqueKey="id"
                              subKey="children"
                              expandDropDowns={true}
                              selectText="Choose State..."
                              showDropDowns={true}
                              readOnlyHeadings={true}
                              onSelectedItemsChange={value =>
                                this.setState({selectedState: value})
                              }
                              selectedItems={this.state.selectedState}
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
                                  style={{marginLeft: 15}}
                                />
                              }
                              colors={color}
                              styles={multiSelectStyles}
                            />
                          )}
                        </View>
                        {/* <Input
                          placeholder="Please enter your state..."
                          placeholderTextColor="#f1faee"
                          onChangeText={text => this.setState({ state: text })}
                          style={styles.input}
                        /> */}
                      </View>

                      <View>
                        <View style={{paddingLeft: 16}}>
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
                          {this.state.loading == false && this.state.cities && (
                            <SectionedMultiSelect
                              items={this.state.cities}
                              uniqueKey="id"
                              subKey="children"
                              expandDropDowns={true}
                              selectText="Choose City..."
                              showDropDowns={true}
                              readOnlyHeadings={true}
                              onSelectedItemsChange={value =>
                                this.setState({selectedCity: value})
                              }
                              selectedItems={this.state.selectedCity}
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
                                  style={{marginLeft: 15}}
                                />
                              }
                              colors={color}
                              styles={multiSelectStyles}
                            />
                          )}
                        </View>
                      </View>

                      <Item style={styles.item}>
                        <Input
                          placeholder="6 Digits Password"
                          placeholderTextColor="#f1faee"
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
                      </Item>

                      <Item style={styles.item}>
                        <Input
                          placeholder="Confirm Password"
                          placeholderTextColor="#f1faee"
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
                      </Item>
                    </Form>
                  </Content>
                </CardItem>

                <CardItem footer style={styles.buttonGroup}>
                  <View style={styles.cardFooter}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                      style={styles.cancel}>
                      <Text style={styles.cancelText}>CANCEL</Text>
                    </TouchableOpacity>

                    <Button
                      backgroundColor="#47BFB3"
                      style={styles.submitButton}
                      onPress={() => this.submit()}>
                      {this.state.buttonLoading == true && (
                        <Spinner color="green" />
                      )}
                      <Text style={styles.submitButtonText}>SUBMIT</Text>
                    </Button>
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
                backgroundColor: '#9bf6ff',
              }}>
              <View style={{height: 222}}>
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
    backgroundColor: '#457b9d',
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
    backgroundColor: '#457b9d',
  },
  picker: {
    marginLeft: 20,
    color: 'white',
  },
  input: {
    fontSize: 14,
    fontFamily: 'Montserrat-MediumItalic',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(29, 53, 87, 0.5)',
    paddingLeft: 24,
    color: '#fff',
  },
  item: {
    marginBottom: 20,
    borderColor: 'transparent',
  },
  titleView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleText: {
    fontSize: 28,
    //fontWeight: "bold",
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
  logoView: {
    // marginTop: 40,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d3557',
    borderBottomRightRadius: 68,
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
    marginTop: 20,
  },
  submitButton: {
    width: 179,
    justifyContent: 'center',
    borderRadius: 14,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
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
    backgroundColor: '#457b9d',
  },
});

//multiselect style
const multiSelectStyles = StyleSheet.create({
  container: {
    backgroundColor: '#457b9d',
  },
  selectToggleText: {color: 'white', fontFamily: 'Montserrat-medium'},
  button: {backgroundColor: '#D94526'},
  searchBar: {backgroundColor: '#457b9d'},
  searchTextInput: {color: '#D94526'},
});
const color = {
  text: '#D94526',
  subText: '#47BFB3',
  searchPlaceholderTextColor: '#D94526',
  itemBackground: '#457b9d',
  subItemBackground: '#457b9d',
};
