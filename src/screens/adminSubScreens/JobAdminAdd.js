import * as authentication from '../../services/Authentication';
import * as dataService from '../../services/DataService';
import * as constant from '../../services/Constant';
import * as formatDate from '../../services/FormatDate';
import * as toastService from '../../services/ToastService';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Linking, Alert} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import Slideshow from 'react-native-image-slider-show';
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
  Tabs,
  Tab,
  TabHeading,
  Icon,
} from 'native-base';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default class JobAdminAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Ionicon name="arrow-back-outline" color="#fff" size={28} />
              </TouchableOpacity>
            </View>
            <View>
              <Title style={styles.headerBodyText}>Add Job Category</Title>
            </View>
            <View />
          </View>
        </Header>
        <Content>
          <View style={styles.card}>
            <Card>
              <CardItem style={styles.cardTitle}>
                <Content>
                  <Form>
                    <View style={styles.descriptionView}>
                      <Textarea
                        rowSpan={5}
                        bordered
                        placeholder="Enter your job category decription"
                        placeholderTextColor="#D94526"
                        onChangeText={text =>
                          this.setState({description: text})
                        }
                      />
                    </View>
                  </Form>
                </Content>
              </CardItem>
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
      </Container>
    );
  }

  async submit() {
    this.setState({buttonLoading: true});
    const {description} = this.state;

    if (description.trim() == '') {
      toastService.error('Error: ' + 'Description cannot be empty!');

      this.setState({buttonLoading: false});
      return;
    }

    var user = await authentication.getLoggedInUser();

    var data = {
      description: description,
      createByEmail: user.email,
    };

    var result = await dataService.post('api/jobcategories/add', data);
    if (result.status === 200) {
      toastService.success('Add job category successfully!');

      this.setState({buttonLoading: false});
      this.props.navigation.state.params.onGoBack();
      this.props.navigation.goBack();
    } else {
      this.setState({buttonLoading: false});
      toastService.error(
        'Error: ' + 'Something wrong! Please check and try again',
      );
    }
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
    justifyContent: 'center',
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
