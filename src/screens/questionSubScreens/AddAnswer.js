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
import Icon from 'react-native-vector-icons/Ionicons';

export default class AddAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      id: props.navigation.state.params.id,
      loading: false,
    };

    this.submit = this.submit.bind(this);
  }

  async submit() {
    this.setState({buttonLoading: true});
    const {description, id} = this.state;

    if (description.trim() == '') {
      toastService.error('Error: ' + 'Description cannot be empty!');

      this.setState({buttonLoading: false});
      return;
    }

    var user = await authentication.getLoggedInUser();

    var data = {
      answerDescription: description,
      createByEmail: user.email,
      questionID: id,
    };

    var result = await dataService.post('api/faqanswers/add', data);
    if (result.status === 200) {
      toastService.success('Add answer successfully!');

      this.setState({buttonLoading: false});
      this.props.navigation.goBack();
      this.props.navigation.navigate('QuestionDetail', {
        addQuestionSuccess: true,
      });
    } else {
      this.setState({buttonLoading: false});
      toastService.error(
        'Error: ' + 'Something wrong! Please check and try again',
      );
    }
  }

  render() {
    const {profile, loading, description} = this.state;

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
              <Title style={styles.headerBodyText}>Answer</Title>
            </View>
            <View />
          </View>
        </Header>
        {loading == false ? (
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
                          placeholder="Enter your answer"
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
