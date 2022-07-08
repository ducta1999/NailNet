import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
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
  Header,
  Label,
  Spinner,
  Textarea,
} from 'native-base';
import * as dataService from '../../services/DataService';
import * as toastService from '../../services/ToastService';
import * as authentication from '../../services/Authentication';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSelect from '../Components/MultiSelect';
import Loading from '../Components/Loading';
import Carousel from 'react-native-snap-carousel';
import LottieView from 'lottie-react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

export default class AddClassified extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      address: '',
      phone: '',
      email: '',
      description: '',
      price: 0,
      discount: 0,
      categories: [],
      loading: true,
      selectedCategory: [],
      avatarSource: [],
      buttonLoading: false,
      options: {
        title: 'Select Avatar',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      },
      paginationData: [
        {title: 'Category', isCompleted: false},
        {title: 'Summary', isCompleted: false},
        {title: 'Detail', isCompleted: false},
      ],
      currentIndex: 0,
      success: false,
    };
  }

  async componentDidMount() {
    var mainCategoriesInDB = await dataService.get(
      'api/classifiedcategories/getallmain',
    );

    var item = [];

    for (var i = mainCategoriesInDB.items.length - 1; i >= 0; i--) {
      var subCategory = await dataService.get(
        'api/classifiedcategories/getall?parentid=' +
          mainCategoriesInDB.items[i].id,
      );

      var children = [];
      for (var j = 0; j < subCategory.items.length; j++) {
        children.push({
          name: subCategory.items[j].description,
          id: subCategory.items[j].id,
        });
      }

      item.push({
        name: mainCategoriesInDB.items[i].description,
        id: mainCategoriesInDB.items[i].id,
        children: children,
      });
    }

    this.setState({loading: false, categories: item});
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
  }

  async submit() {
    try {
      var user = await authentication.getLoggedInUser();
      this.setState({buttonLoading: true});
      const {
        selectedCategory,
        avatarSource,
        title,
        address,
        phone,
        email,
        description,
        price,
        discount,
      } = this.state;

      if (title.trim() === '' || description.trim() === '') {
        toastService.error('Please enter all the summary information.');
        this.swapSlide.snapToItem(1);
      } else if (selectedCategory.length === 0) {
        toastService.error('Please select the category.');
        this.swapSlide.snapToItem(0);
      } else {
        var data = {
          createByEmail: user.email,
          title: title,
          address: address,
          price: price,
          description: description,
          discount: discount,
          categoryID: selectedCategory[0],
          email: user.email,
          phone: phone,
        };

        var result = await dataService.post('api/classifieds/add', data);

        if (result.status === 200) {
          this.setState({
            buttonLoading: false,
            success: true,
          });

          for (var i = 0; i < avatarSource.length; i++) {
            var image = avatarSource[i];
            var data = {
              classiFiedID: result.data.id,
              createByEmail: user.email,
            };

            var classifiedimage = await dataService.post(
              'api/classifiedimages/add',
              data,
            );

            dataService.post(
              'api/classifiedimages/upload/' + classifiedimage.data.id,
              {
                extension: '.' + image.extension,
                base64: image.base64,
              },
            );
          }
          setTimeout(() => {
            this.setState({
              success: false,
            });
            this.props.navigation.goBack();
          }, 999);
          toastService.success('Add classified successfully!');
        } else {
          toastService.error('Error: ' + result.data);
        }
      }
    } catch (error) {
      console.log(error);
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
        key: 'category',
        view: (
          <>
            <Text style={styles.subTitle}>Choose Your Category</Text>
            <View style={{marginBottom: 9}}>
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
        key: 'summary',
        view: (
          <>
            <Text style={styles.subTitle}>Information</Text>
            <View style={styles.item}>
              <Icon
                name="information-circle-outline"
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
                      {
                        title: 'Summary',
                        isCompleted:
                          text.trim() !== '' &&
                          this.state.description.trim !== '',
                      },
                      ...this.state.paginationData.slice(2),
                    ],
                  });
                }}
                style={styles.input}
              />
            </View>
            <View style={styles.item}>
              <Icon
                name="information-circle-outline"
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
                      {
                        title: 'Summary',
                        isCompleted:
                          text.trim() !== '' && this.state.title.trim !== '',
                      },
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
        key: 'detail',
        view: (
          <>
            <Text style={styles.subTitle}>Detail</Text>
            <View style={styles.item}>
              <Icon
                name="information-circle-outline"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                keyboardType="numeric"
                placeholder="Price"
                placeholderTextColor="#6c757d"
                onChangeText={text => {
                  this.setState({
                    price: parseFloat(text),
                    paginationData: [
                      ...this.state.paginationData.slice(0, 2),
                      {
                        title: 'Detail',
                        isCompleted: text.trim() !== '',
                      },
                    ],
                  });
                }}
                style={styles.input}
              />
            </View>
            <View style={styles.item}>
              <Icon
                name="information-circle-outline"
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
                    discount: parseFloat(text),
                  });
                }}
                style={styles.input}
              />
            </View>
            <View style={styles.item}>
              <Icon
                name="information-circle-outline"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                keyboardType="numeric"
                placeholder="Phone"
                placeholderTextColor="#6c757d"
                onChangeText={text => {
                  this.setState({
                    phone: text,
                  });
                }}
                style={styles.input}
              />
            </View>
            <View style={styles.item}>
              <Icon
                name="information-circle-outline"
                color="#6c757d"
                size={24}
                style={styles.icon}
              />
              <Input
                placeholder="Address"
                placeholderTextColor="#6c757d"
                onChangeText={text => {
                  this.setState({
                    address: text,
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
          <Text style={styles.title}>Add Classified</Text>
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
