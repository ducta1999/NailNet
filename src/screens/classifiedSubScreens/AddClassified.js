import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
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

    if (
      title.trim() == '' ||
      address.trim() == '' ||
      description.trim() == '' ||
      email.trim() == '' ||
      phone.trim() == '' ||
      selectedCategory.length == 0
    ) {
      toastService.error('Error: ' + 'Input cannot be empty!');
    } else {
      var data = {
        createByEmail: user.email,
        title: title,
        address: address,
        price: price,
        description: description,
        discount: discount,
        categoryID: selectedCategory[0],
        email: email,
        phone: phone,
      };

      var result = await dataService.post('api/classifieds/add', data);

      if (result.status === 200) {
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
        toastService.success('Add classified successfully!');
      } else {
        toastService.error('Error: ' + result.data);
      }

      this.props.navigation.goBack();
    }

    this.setState({buttonLoading: false});
  }

  render() {
    const {
      title,
      address,
      description,
      price,
      discount,
      loading,
      categories,
      selectedCategory,
      avatarSource,
      options,
      buttonLoading,
      phone,
      email,
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
              <View>
                <Text style={styles.title}>ADD CLASSIFIED</Text>
              </View>
            </View>
            <View />
          </View>
        </Header>

        <Content>
          {loading == false ? (
            <Card transparent>
              <CardItem style={styles.carditem}>
                <Content>
                  <Form>
                    <View style={styles.item}>
                      <Button
                        block
                        backgroundColor="#D94526"
                        onPress={() => this.showImagePicker(options)}>
                        <Text>Add image</Text>
                      </Button>

                      {avatarSource && (
                        <ScrollView
                          horizontal={true}
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            marginTop: 10,
                          }}>
                          {avatarSource.map((item, i) => (
                            <Image
                              //source={item.source}
                              source={{
                                uri: `data:${item.mime};base64,${item.base64}`,
                              }}
                              style={{
                                width: 100,
                                height: 100,
                                resizeMode: 'contain',
                              }}
                            />
                          ))}
                        </ScrollView>
                      )}
                    </View>

                    <Item style={styles.item}>
                      <Label style={styles.label}>Title</Label>
                      <Input
                        placeholder="Please enter title..."
                        placeholderTextColor="#848484"
                        onChangeText={text => this.setState({title: text})}
                        value={title}
                        style={styles.input}
                      />
                    </Item>

                    <View
                      style={{
                        marginLeft: 14,
                        marginTop: 10,
                      }}>
                      <View>
                        <Label style={styles.label}>Category</Label>
                      </View>
                      <View
                        style={{
                          marginLeft: 60,
                          justifyContent: 'center',
                          marginTop: -43,
                        }}>
                        {this.state.loading == false && (
                          <MultiSelect
                            backgroundColor="#0065ff"
                            items={this.state.categories}
                            placeHolder="Choose category"
                            selectedItems={this.state.selectedCategory}
                            setSelectedItems={value => {
                              this.setState({selectedCategory: value});
                            }}
                          />
                        )}
                      </View>
                    </View>

                    <Item style={styles.item}>
                      <Label style={styles.label}>Address</Label>
                      <Input
                        placeholder="Please enter address.."
                        placeholderTextColor="#848484"
                        onChangeText={text => this.setState({address: text})}
                        value={address}
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item}>
                      <Label style={styles.label}>Email</Label>
                      <Input
                        placeholder="Please enter email.."
                        placeholderTextColor="#848484"
                        onChangeText={text => this.setState({email: text})}
                        value={email}
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item}>
                      <Label style={styles.label}>Phone</Label>
                      <Input
                        placeholder="Please enter phone.."
                        placeholderTextColor="#848484"
                        onChangeText={text => this.setState({phone: text})}
                        value={phone}
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item}>
                      <Label style={styles.label}>Price ($)</Label>
                      <Input
                        placeholder="Please enter your price..."
                        placeholderTextColor="#848484"
                        keyboardType="numeric"
                        onChangeText={
                          text => this.setState({price: parseFloat(text)})
                          //   this.setState({
                          //     price:
                          //       text.replace(/\D/, "") == ""
                          //         ? ""
                          //         : parseInt(text.replace(/\D/, ""))
                          //   })
                        }
                        value={price}
                        style={styles.input}
                      />
                    </Item>
                    <Item style={styles.item}>
                      <Label style={styles.label}>Discount (%)</Label>
                      <Input
                        placeholder="Please enter your discount..."
                        placeholderTextColor="#848484"
                        keyboardType="numeric"
                        onChangeText={
                          text => this.setState({discount: parseFloat(text)})
                          //   this.setState({
                          //     price:
                          //       text.replace(/\D/, "") == ""
                          //         ? ""
                          //         : parseInt(text.replace(/\D/, ""))
                          //   })
                        }
                        value={discount}
                        style={styles.input}
                      />
                    </Item>

                    <Item style={styles.item} stackedLabel>
                      <Label style={styles.label}>Decription</Label>
                      <Textarea
                        placeholder="Please enter your description..."
                        placeholderTextColor="#848484"
                        rowSpan={5}
                        //bordered
                        onChangeText={text =>
                          this.setState({description: text})
                        }
                        value={description}
                        style={styles.textArea}
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
                    {buttonLoading == true && <Spinner color="green" />}
                    <Text style={styles.submitButtonText}>SUBMIT</Text>
                  </Button>
                </View>
              </CardItem>
            </Card>
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
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  title: {
    fontSize: 15,
    color: '#47BFB3',
    marginTop: 5,
    //marginRight: 80,
    marginTop: 10,
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
  carditem: {
    backgroundColor: '#1F2426',
  },
  item: {
    marginBottom: 20,
    borderColor: 'transparent',
  },
  input: {
    color: 'white',
  },
  textArea: {
    width: '100%',
    color: 'white',
  },
  label: {
    fontSize: 15,
    color: '#D94526',
  },
  cardFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonGroup: {
    backgroundColor: '#1F2426',
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
    marginTop: 10,
    marginLeft: 15,
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
