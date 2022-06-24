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
                <Icon name="arrow-back-outline" color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <View>
              <Title style={styles.headerBodyText}>
                {description.toUpperCase()}
              </Title>
            </View>
            <View />
          </View>
        </Header>
        {loading == false ? (
          <Content>
            <View style={styles.avatar}>
              <Thumbnail
                large
                //source={require("../../icons/Avatar.png")}
                defaultSource={{uri: 'avatar'}}
                source={{uri: this.state.uri}}
                style={styles.thumbnail}
                // onError={() =>
                //   this.setState({
                //     uri: "avatar"
                //     //uriValid: false
                //   })
                // }
              />
            </View>

            <View style={styles.informationView}>
              <Text style={styles.name}>
                {profile.firstName} {profile.lastName}
              </Text>
              <Text style={styles.information}>{profile.businessAddress}</Text>
              <Text style={styles.information}>{profile.businessSummary}</Text>
            </View>

            <View style={styles.card}>
              <Card>
                <CardItem header style={styles.cardHeader}>
                  <Text style={styles.cardHeaderText}>
                    ASK DOCTOR A QUESTION
                  </Text>
                </CardItem>

                <CardItem style={styles.cardTitle}>
                  <Content>
                    <Form>
                      <Item>
                        <Input
                          style={styles.titleInput}
                          placeholder="Title"
                          placeholderTextColor="#D94526"
                          onChangeText={text => this.setState({title: text})}
                        />
                      </Item>

                      <View style={styles.descriptionView}>
                        <Textarea
                          rowSpan={5}
                          bordered
                          placeholder="Description"
                          placeholderTextColor="#D94526"
                          onChangeText={text =>
                            this.setState({descriptionQuestion: text})
                          }
                        />
                      </View>
                    </Form>
                  </Content>
                </CardItem>
                <CardItem />
              </Card>
            </View>

            <View style={styles.submitButtonView}>
              <Button
                block
                backgroundColor="#47BFB3"
                style={styles.submitButton}
                onPress={() => this.submit()}>
                {this.state.buttonLoading == true && <Spinner color="red" />}
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </Button>
            </View>
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

  goTabBack() {
    this.props.navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2426',
  },
  avatar: {
    alignItems: 'center',
  },
  informationView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 40,
  },
  name: {
    fontWeight: 'bold',
    color: '#D94526',
    fontSize: 15,
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
  titleInput: {
    //marginLeft: -70
  },
  card: {
    left: 0,
    //marginTop: 20,
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
    fontWeight: 'bold',
  },
  submitButtonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {},
  thumbnailArrow: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
});
