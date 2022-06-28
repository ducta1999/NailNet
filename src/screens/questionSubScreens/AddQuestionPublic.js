import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
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
  Picker,
  Input,
  Spinner,
} from 'native-base';
import LottieView from 'lottie-react-native';

import * as dataService from '../../services/DataService';
import * as toastService from '../../services/ToastService';
import * as authentication from '../../services/Authentication';
import Carousel from 'react-native-snap-carousel';
import MultiSelect from '../Components/MultiSelect';
import Icon from 'react-native-vector-icons/Ionicons';

export default class AddQuestionPublic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faqindustries: [],
      loading: true,
      selectedIndustry: [],
      title: '',
      description: '',
      buttonLoading: false,
      carousel: '',
    };
    this.goTabBack = this.goTabBack.bind(this);
  }

  async componentDidMount() {
    var industries = await dataService.get('api/faqindustries/getall');
    var itemIndustries = [{name: 'Industry', id: 0, children: []}];

    for (var j = 0; j < industries.items.length; j++) {
      itemIndustries[0].children.push({
        name: industries.items[j].description,
        id: industries.items[j].id,
      });
    }

    this.setState({
      loading: false,
      faqindustries: itemIndustries,
      selectedIndustry:
        this.state.selectedIndustry.concat[itemIndustries[0].children[0].id],
    });
  }

  async submit() {
    try {
      this.setState({buttonLoading: true});
      const {title, description, selectedIndustry} = this.state;

      if (title.trim() == '') {
        toastService.error('Error: ' + 'Title cannot be empty!');

        this.setState({buttonLoading: false});
        return;
      }

      if (description.trim() == '') {
        toastService.error('Error: ' + 'dDscription cannot be empty!');

        this.setState({buttonLoading: false});
        return;
      }

      var user = await authentication.getLoggedInUser();

      var data = {
        industryID: selectedIndustry[0],
        private: false,
        statusID: 0,
        createByEmail: user.email,
        title: title,
        description: description,
        view: 0,
      };

      var result = await dataService.post('api/faqquestions/add', data);
      if (result.status === 200) {
        toastService.success('Add question successfully!');

        this.setState({buttonLoading: false});
        this.props.navigation.goBack();
      } else {
        this.setState({buttonLoading: false});
        toastService.error(
          'Error: ' + 'Something wrong! Please check and try again',
        );
        console.log(JSON.stringify(result, 0, 2));
      }
    } catch (error) {
      console.log(error);
    }
  }

  swapSlide = value => {
    this.setState({carousel: value});
  };

  render() {
    const {width} = Dimensions.get('window');
    const dataCarousel = [
      {
        key: 'industry',
        view: (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                width: '100%',
              }}>
              {this.state.loading == false && (
                <MultiSelect
                  items={this.state.faqindustries}
                  placeHolder="Choose Industry..."
                  selectedItems={this.state.selectedIndustry}
                  setSelectedItems={value =>
                    this.setState({selectedIndustry: value})
                  }
                />
              )}
            </View>
            <Button
              block
              backgroundColor="#168aad"
              style={styles.submitButton}
              onPress={() => this.swapSlide.snapToNext()}>
              <Text style={styles.submitButtonText}>NEXT</Text>
            </Button>
          </View>
        ),
      },
      {
        key: 'description',
        view: (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
            }}>
            <View style={{height: 79}}>
              <Text style={styles.subTitle}>Title</Text>
              <Input
                style={styles.titleInput}
                placeholder=""
                placeholderTextColor="#D94526"
                onChangeText={text => this.setState({title: text})}
              />
            </View>
            <View>
              <Text style={styles.subTitle}>Description</Text>
              <Textarea
                style={[styles.titleInput, {paddingTop: 12}]}
                rowSpan={4}
                placeholder=""
                onChangeText={text => this.setState({description: text})}
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
                backgroundColor="#6c757d"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.swapSlide.snapToPrev()}>
                <Text style={styles.submitButtonText}>Previous Step</Text>
              </Button>
              <Button
                block
                backgroundColor="#184e77"
                style={[styles.submitButton, {width: '48%'}]}
                onPress={() => this.submit()}>
                {this.state.buttonLoading == true && <Spinner color="red" />}
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </Button>
            </View>
          </View>
        ),
      },
    ];
    return (
      <Container style={styles.container}>
        <Header transparent>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <TouchableOpacity onPress={() => this.goTabBack()}>
                <Icon name="arrow-back-outline" color="#212529" size={28} />
              </TouchableOpacity>
            </View>

            <View />
          </View>
        </Header>
        <View style={{flex: 0.9}}>
          <LottieView
            source={require('../../json/support.json')}
            autoPlay
            loop
          />
        </View>
        {this.state.loading == false ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              borderTopLeftRadius: 48,
              borderTopRightRadius: 48,
              backgroundColor: '#f2f2f2',
              marginTop: -36,
            }}>
            <View style={styles.card}>
              <Text style={styles.title}>Create a Question</Text>
              <Carousel
                scrollEnabled={false}
                ref={value => (this.swapSlide = value)}
                data={dataCarousel}
                renderItem={({item}) => item.view}
                sliderWidth={width - 72}
                itemWidth={width - 72}
              />
            </View>
          </ScrollView>
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

  goTabBack() {
    this.props.navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 9,
    color: '#343a40',
  },
  subTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    color: '#6c757d',
    padding: 4,
    paddingLeft: 9,
    marginTop: 9,
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 9,
    padding: 6,
    paddingLeft: 9,
    fontSize: 12.9,
    fontFamily: 'Montserrat-Medium',
  },
  picker: {
    marginLeft: 0,
    color: '#D94526',
  },

  headerBodyText: {
    // marginLeft: 7,
    fontSize: 20,
    color: '#47BFB3',
    marginTop: 5,
    fontFamily: 'Montserrat-Medium',
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 36,
  },
  descriptionView: {
    marginTop: 10,
    marginLeft: 16,
  },
  submitButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
  },
  submitButtonView: {
    //marginTop: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    marginRight: 10,
  },
  submitButton: {
    borderRadius: 5,
    marginTop: 15,
  },
  thumbnail: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});
