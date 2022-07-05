import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
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
  Textarea,
} from 'native-base';
// import ImagePicker from "react-native-image-picker";
import ImagePicker from 'react-native-image-crop-picker';
import * as dataService from '../../services/DataService';
import * as formatDate from '../../services/FormatDate';
import * as toastService from '../../services/ToastService';
import * as authentication from '../../services/Authentication';
import Icon from 'react-native-vector-icons/Ionicons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSelect from '../Components/MultiSelect';
import Carousel from 'react-native-snap-carousel';
import Loading from '../Components/Loading';
import LottieView from 'lottie-react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

export default class AddPromotion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      title: '',
      location: '',
      discount: 0,
      description: '',
      rawFromDate: new Date(),
      rawToDate: new Date(),
      fromDate: new Date(),
      toDate: new Date(),
      cities: [],
      selectedCity: [],
      isFromDateTimePickerVisible: false,
      isToDateTimePickerVisible: false,
      selectedCategory: [],
      categories: [],
      buttonLoading: false,
      options: {
        title: 'Select Avatar',
        //customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      avatarSource: [],
      paginationData: [
        {title: 'Category', isCompleted: false},
        {title: 'Information', isCompleted: false},
        {title: 'Date Expire', isCompleted: false},
      ],
      success: false,
      openFromDate: false,
      openToDate: false,
      currentIndex: 0,
    };
  }

  async componentDidMount() {
    // var cities = await dataService.getOnlineData(
    //   "https://thongtindoanhnghiep.co/api/city"
    // );
    var cities = await dataService.getProvince();
    var itemCities = [{name: 'City', id: 0, children: []}];

    for (var j = 0; j < cities.length; j++) {
      itemCities[0].children.push({
        name: cities[j].name,
        id: cities[j].name,
      });
    }

    var categories = await dataService.get('api/promotioncategories/getall');
    var itemCategories = [{name: 'Category', id: 0, children: []}];

    for (var j = categories.items.length - 1; j >= 0; j--) {
      itemCategories[0].children.push({
        name: categories.items[j].description,
        id: categories.items[j].id,
      });
    }

    this.setState({
      loading: false,
      cities: itemCities,
      categories: itemCategories,
      //  selectedCategory: faqindustries.items[0].id
    });
  }

  showFromDateTimePicker = () => {
    this.setState({isFromDateTimePickerVisible: true});
  };

  hideFromDateTimePicker = () => {
    this.setState({isFromDateTimePickerVisible: false});
  };

  handleFromDatePicked = date => {
    this.setState({fromDate: formatDate.formatDate(date), rawFromDate: date});
    this.hideFromDateTimePicker();
  };

  showToDateTimePicker = () => {
    this.setState({isToDateTimePickerVisible: true});
  };

  hideToDateTimePicker = () => {
    this.setState({isToDateTimePickerVisible: false});
  };

  handleToDatePicked = date => {
    this.setState({toDate: formatDate.formatDate(date), rawToDate: date});
    this.hideToDateTimePicker();
  };

  async submit() {
    var user = await authentication.getLoggedInUser();
    this.setState({buttonLoading: true});

    const {
      title,
      selectedCategory,
      discount,
      description,
      rawFromDate,
      rawToDate,
      selectedCity,
      avatarSource,
    } = this.state;

    if (
      title.trim() == '' ||
      selectedCity.length == 0 ||
      selectedCategory.length == 0 ||
      description.trim() == '' ||
      rawFromDate == null ||
      rawToDate == null
    ) {
      toastService.error('Error: ' + 'Input cannot be empty!');
    } else if (!formatDate.checkIsBefore(rawFromDate, rawToDate)) {
      toastService.error(
        'Error: ' + 'From Date and To Date is not valid. Please check again',
      );
    } else {
      var data = {
        title: title,
        phone: '',
        email: user.email,
        discount: discount,
        description: description,
        fromDate: formatDate.formatDateToSendAPI(rawFromDate),
        toDate: formatDate.formatDateToSendAPI(rawToDate),
        location: selectedCity[0],
        categoryID: selectedCategory[0],
        createByEmail: user.email,
      };

      var result = await dataService.post('api/promotions/add', data);

      if (result.status === 200) {
        toastService.success('Add promotion successfully!');

        for (var i = 0; i < avatarSource.length; i++) {
          var image = avatarSource[i];
          var data = {
            promotionID: result.data.id,
            createByEmail: user.email,
          };
          var promotionpicture = await dataService.post(
            'api/promotionpictures/add',
            data,
          );

          dataService.post(
            'api/promotionpictures/upload/' + promotionpicture.data.id,
            {
              extension: '.' + image.extension,
              base64: image.base64,
            },
          );
        }

        this.props.navigation.goBack();
      } else {
        toastService.error('Error: ' + result.data);
      }
    }
    this.setState({buttonLoading: false});
  }

  async showImagePicker(options) {
    if (this.state.avatarSource && this.state.avatarSource.length >= 5) {
      toastService.error('Error: ' + 'You only can add 5 image');
      return;
    }
    ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
    }).then(images => {
      if (images.length > 5) {
        toastService.error('Error: ' + 'You only can add 5 image');
        images = images.slice(0, 5);
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
    // ImagePicker.showImagePicker(options, response => {
    //   console.log(response);
    //   if (response.didCancel) {
    //     console.log("User cancelled image picker");
    //   } else if (response.error) {
    //     console.log("ImagePicker Error: ", response.error);
    //   } else if (response.customButton) {
    //     console.log("User tapped custom button: ", response.customButton);
    //   } else {
    //     const source = { uri: response.uri };
    //     const data = response.data;
    //     const type = response.type;

    //     var image = {
    //       source: source,
    //       base64: data,
    //       extension: type == null ? "png" : type.split("/")[1]
    //     };
    //     // console.log({
    //     //   extension: "." + image.extension,
    //     //   base64: image.base64
    //     // });

    //     // dataService.post("api/promotionpictures/upload/1", {
    //     //   extension: "." + image.extension,
    //     //   base64: image.base64
    //     // });

    //     this.setState({
    //       avatarSource: this.state.avatarSource.concat([image])
    //     });
    //   }
    // });
  }

  swapSlide = value => {
    this.setState({carousel: value});
  };

  render() {
    const {width} = Dimensions.get('window');

    const dataCarousel = [
      {
        key: 'category',
        view: (
          <>
            <Text style={styles.subTitle}>Choose Your Category</Text>
            <View style={{marginBottom: 9}}>
              {this.state.loading === false && (
                <MultiSelect
                  backgroundColor="#0065ff"
                  items={this.state.categories}
                  placeHolder="Choose Category"
                  selectedItems={this.state.selectedCategory}
                  setSelectedItems={value => {
                    this.setState({
                      selectedCategory: value,
                      paginationData: [
                        {title: 'Category', isCompleted: true},
                        ...this.state.paginationData.slice(1),
                      ],
                    });
                  }}
                />
              )}
            </View>
            <View style={{marginBottom: 9}}>
              <MultiSelect
                backgroundColor="#0065ff"
                items={this.state.cities}
                placeHolder="Choose City"
                selectedItems={this.state.selectedCity}
                setSelectedItems={value => {
                  this.setState({
                    selectedCity: value,
                  });
                }}
              />
            </View>

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
        key: 'information',
        view: (
          <>
            <Text style={styles.subTitle}>Enter promote information</Text>
            <View style={styles.item}>
              <Icon
                name="information-circle"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                placeholder="Title"
                placeholderTextColor="#6c757d"
                onChangeText={text => {
                  this.setState({
                    title: text,
                    paginationData: [
                      ...this.state.paginationData.slice(0, 1),
                      {title: 'Information', isCompleted: text.trim() !== ''},
                      ...this.state.paginationData.slice(2),
                    ],
                  });
                }}
                style={styles.input}
              />
            </View>
            <View style={styles.item}>
              <Icon
                name="information-circle"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                placeholder="Description"
                placeholderTextColor="#6c757d"
                onChangeText={text => {
                  this.setState({
                    description: text,
                    paginationData: [
                      ...this.state.paginationData.slice(0, 1),
                      {title: 'Information', isCompleted: text.trim() !== ''},
                      ...this.state.paginationData.slice(2),
                    ],
                  });
                }}
                style={styles.input}
              />
            </View>

            <View style={styles.item}>
              <Icon
                name="information-circle"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                keyboardType="numeric"
                placeholder="Discount"
                placeholderTextColor="#6c757d"
                onChangeText={text => {
                  this.setState({
                    description: text,
                    paginationData: [
                      ...this.state.paginationData.slice(0, 1),
                      {title: 'Information', isCompleted: text.trim() !== ''},
                      ...this.state.paginationData.slice(2),
                    ],
                  });
                }}
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
        key: 'date',
        view: (
          <>
            <Text style={styles.subTitle}>Select expire date</Text>
            <Text style={[styles.dateTxt, {color: '#6c757d'}]}>From</Text>
            <TouchableOpacity
              activeOpacity={0.79}
              onPress={() => this.setState({openFromDate: true})}>
              <View style={[styles.row, styles.dateInput]}>
                <Text style={styles.dateTxt}>
                  {moment(this.state.rawFromDate).format('LLL')}
                </Text>
                <Icon name="calendar" size={22} color="#3a86ff" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.dateTxt, {color: '#6c757d'}]}>To</Text>
            <TouchableOpacity
              activeOpacity={0.79}
              onPress={() => this.setState({openToDate: true})}>
              <View style={[styles.row, styles.dateInput]}>
                <Text style={styles.dateTxt}>
                  {moment(this.state.rawToDate).format('LLL')}
                </Text>
                <Icon name="calendar" size={22} color="#3a86ff" />
              </View>
            </TouchableOpacity>
            <DatePicker
              modal
              open={this.state.openFromDate}
              date={this.state.rawFromDate}
              onConfirm={date => {
                if (
                  moment(date).diff(moment(this.state.rawToDate), 'minutes') > 0
                ) {
                  this.setState({
                    openFromDate: false,
                    toDate: moment(date).format('DD-MM-yyyy'),
                    fromDate: moment(date).format('DD-MM-yyyy'),
                    rawToDate: date,
                    rawFromDate: date,
                  });
                } else {
                  this.setState({
                    openFromDate: false,
                    fromDate: moment(date).format('DD-MM-yyyy'),
                    rawFromDate: date,
                  });
                }
              }}
              onCancel={() => {
                this.setState({openFromDate: false});
              }}
            />
            <DatePicker
              modal
              open={this.state.openToDate}
              date={this.state.rawToDate}
              onConfirm={date => {
                if (
                  moment(date).diff(moment(this.state.rawFromDate), 'minutes') <
                  0
                ) {
                  this.setState({
                    openToDate: false,
                    toDate: moment(date).format('DD-MM-yyyy'),
                    fromDate: moment(date).format('DD-MM-yyyy'),
                    rawToDate: date,
                    rawFromDate: date,
                  });
                } else {
                  this.setState({
                    openToDate: false,
                    toDate: moment(date).format('DD-MM-yyyy'),
                    rawToDate: date,
                  });
                }
              }}
              onCancel={() => {
                this.setState({openToDate: false});
              }}
            />

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
                style={[
                  styles.submitButton,
                  {
                    width: '48%',
                  },
                ]}
                onPress={() => this.submit()}>
                {this.state.buttonLoading ? (
                  <View style={{height: 99, width: 99}}>
                    <LottieView
                      source={require('../../json/dotLoading.json')}
                      autoPlay
                    />
                  </View>
                ) : this.state.success === true ? (
                  <View style={{height: 99, width: 99}}>
                    <LottieView
                      speed={2.5}
                      source={require('../../json/success.json')}
                      autoPlay
                    />
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>Create</Text>
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
          <Text style={styles.title}>Add Promotion</Text>
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
              style={{width: '28%', marginBottom: 36}}>
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
    fontSize: 18,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTxt: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12.68,
    color: '#343a40',
  },
  dateInput: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#49505739',
    padding: 12,
    marginBottom: 9,
  },
});
