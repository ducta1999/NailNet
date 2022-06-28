import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
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
  Input,
  Spinner,
} from 'native-base';
import * as dataService from '../../services/DataService';
import * as toastService from '../../services/ToastService';
import * as authentication from '../../services/Authentication';
import * as constant from '../../services/Constant';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

export default class DoctorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: {
        name: 'Bui Duy Phuong',
        information: 'DC - Lindale Health Care Chiropractic & Rehab Clinic',
        moreInformation:
          '(Bác sĩ Chỉnh khoa - Các chứng đau nhức, phong thấp, tai nạn xe cộ, thể thao, nghề nghiệp)',
      },
      loading: true,
      profile: [],
      description: props.navigation.state.params.description,
      descriptionQuestion: '',
      industryID: props.navigation.state.params.industryID,
      title: '',
      buttonLoading: false,
      profileProID: props.navigation.state.params.id,
    };

    if (props.navigation.state.params && props.navigation.state.params.id) {
      this.ensureDataFetched(props.navigation.state.params.id);
    }
    this.goTabBack = this.goTabBack.bind(this);
  }

  async ensureDataFetched(id) {
    var profile = await dataService.get('api/profiles/getprofile/' + id);

    this.setState({
      profile: profile,
      loading: false,
      uri:
        constant.BASE_URL +
        'api/avatars/getimage/' +
        profile.email +
        '?random_number=' +
        new Date().getTime(),
    });
  }

  async submit() {
    this.setState({buttonLoading: true});
    const {title, descriptionQuestion, industryID, profileProID} = this.state;

    if (title.trim() == '') {
      toastService.error('Error: ' + 'Title cannot be empty!');

      this.setState({buttonLoading: false});
      return;
    }

    if (descriptionQuestion.trim() == '') {
      toastService.error('Error: ' + 'Decription cannot be empty!');

      this.setState({buttonLoading: false});
      return;
    }

    var user = await authentication.getLoggedInUser();

    var data = {
      profileProID: profileProID,
      industryID: industryID,
      private: true,
      statusID: 1,
      createByEmail: user.email,
      title: title,
      description: descriptionQuestion,
      view: 0,
    };
    console.log(data);
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
    }
  }

  render() {
    const {profile, loading, description, descriptionQuestion, uri} =
      this.state;

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
              <TouchableOpacity onPress={() => this.goTabBack()}>
                <Icon name="close-outline" color="#000" size={28} />
              </TouchableOpacity>
            </View>

            <View />
          </View>
        </Header>
        {loading == false ? (
          <Content>
            <View
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                margin: 9,
              }}>
              <LinearGradient
                start={{x: 0.0, y: 0.25}}
                end={{x: 0.5, y: 1.0}}
                colors={['#011627', '#186a8c', '#011627']}
                style={{
                  padding: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={
                        styles.name
                      }>{`${profile.firstName} ${profile.lastName}`}</Text>
                    <Text style={styles.major}>{description}</Text>
                  </View>

                  <Thumbnail
                    large
                    source={require('../../icons/Avatar.png')}
                    defaultSource={{uri: 'avatar'}}
                    // source={{
                    //   uri:
                    //    this.state.uri
                    // }}
                    style={styles.avatar}
                  />
                </View>
                <View style={{padding: 12}}>
                  <Text style={styles.pd9}>
                    <Text style={styles.titleLeft}>Company: </Text>
                    <Text style={styles.titleRight}>
                      {' '}
                      {profile.businessAddress}
                    </Text>
                  </Text>

                  <Text style={styles.pd9}>
                    <Text style={styles.titleLeft}>Email: {'         '}</Text>
                    <Text style={styles.titleRight}>{profile.email}</Text>
                  </Text>

                  <Text style={styles.pd9}>
                    <Text style={styles.titleLeft}>Phone: {'      '}</Text>
                    <Text style={styles.titleRight}> {profile.phone}</Text>
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: 10,
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
                  onChangeText={text =>
                    this.setState({descriptionQuestion: text})
                  }
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
                  backgroundColor="#184e77"
                  style={[styles.submitButton, {width: '100%'}]}
                  onPress={() => this.submit()}>
                  {this.state.buttonLoading == true && <Spinner color="red" />}
                  <Text style={styles.submitButtonText}>SUBMIT</Text>
                </Button>
              </View>
            </View>
          </Content>
        ) : (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
            }}>
            <View style={{height: 168}}>
              <LottieView
                source={require('../../json/loading.json')}
                autoPlay
                loop
              />
            </View>
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
  avatar: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: 'white',
  },
  informationView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 40,
  },
  name: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
  },
  information: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  thumbnail: {
    width: 150,
    height: 150,
  },

  headerBodyText: {
    // justifyContent: "center",
    //left: 30,
    fontSize: 20,
    color: '#47BFB3',
    marginTop: 5,
  },

  descriptionView: {
    marginTop: 10,
    marginLeft: 16,
  },
  card: {
    backgroundColor: 'red',
    padding: 10,
  },
  cardHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D94526',
  },
  cardHeaderText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardTitle: {
    //marginTop: -20
  },
  submitButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
  submitButtonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    borderRadius: 5,
    marginTop: 15,
  },
  thumbnailArrow: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
  titleLeft: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
  },
  titleRight: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
  },
  major: {
    color: '#89aae6',
    fontSize: 11,
    fontFamily: 'Montserrat-SemiBoldItalic',
  },
  pd9: {
    paddingVertical: 4,
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
    backgroundColor: '#f2f2f2',
    borderRadius: 9,
    padding: 6,
    paddingLeft: 9,
    fontSize: 12.9,
    fontFamily: 'Montserrat-Medium',
  },
});
