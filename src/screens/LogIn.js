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
  Spinner,
} from 'native-base';
import LottieView from 'lottie-react-native';
import * as dataSetvice from '../services/DataService';
import * as toastService from '../services/ToastService';
import * as authentication from '../services/Authentication';
import AnimatedSplash from 'react-native-animated-splash-screen';
import Icon from 'react-native-vector-icons/Ionicons';

export default class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      buttonLoading: false,
      loading: true,
      success: false,
    };
    if (
      props.navigation.state.params &&
      props.navigation.state.params.logout == true
    ) {
      this.setState({
        loading: false,
        buttonLoading: false,
        email: '',
        password: '',
      });
    }
  }

  async componentWillMount() {
    var email = await authentication.getLastLoggedInUserEmail();
    if ((await authentication.checkAccountExisted()) == true) {
      this.props.navigation.navigate('Home');
      this.setState({loading: false, email: email});
    } else {
      this.setState({loading: false, email: email});
    }
  }

  async submit() {
    try {
      this.setState({buttonLoading: true});

      const {email, password} = this.state;

      if (email.trim() == '') {
        toastService.error('Error: ' + 'Email cannot be empty!');
        return;
      }

      if (password.trim() == '') {
        toastService.error('Error: ' + 'Password cannot be empty!');

        return;
      }

      var data = {
        emaiL: email,
        password: password,
      };
      var result = await dataSetvice.post('api/profiles/generatetoken', data);
      if (result.status == 200) {
        toastService.success('Log In Successfully!');
        await authentication.updateAccount(result.data);
        this.setState({
          password: '',
          loading: false,
        });
        this.setState({
          buttonLoading: false,
          password: '',
          loading: false,
          success: true,
        });
        setTimeout(() => {
          this.props.navigation.navigate('Home');
          this.setState({
            success: false,
          });
        }, 999);
      } else {
        toastService.error('Error: ' + result.data);
      }
    } catch (error) {
      toastService.error('Error: ' + error);
    } finally {
      this.setState({buttonLoading: false});
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.logoView}>
            <LottieView
              source={require('../json/welcome.json')}
              autoPlay
              loop
            />
          </View>
          {this.state.loading == false ? (
            <Card transparent style={{padding: 9}}>
              <CardItem style={styles.carditem}>
                <Content>
                  <Text style={styles.title}>Login</Text>
                  <Form>
                    <View style={styles.item}>
                      <Icon
                        name="mail-open-outline"
                        color="#6c757d"
                        size={24}
                        style={styles.icon}
                      />
                      <Input
                        placeholder="Email"
                        placeholderTextColor="#6c757d"
                        onChangeText={text => this.setState({email: text})}
                        style={styles.input}
                        value={this.state.email}
                      />
                    </View>

                    <View style={[styles.item, {marginBottom: 0}]}>
                      <Icon
                        name="lock-closed-outline"
                        color="#6c757d"
                        size={24}
                        style={styles.icon}
                      />
                      <Input
                        secureTextEntry={true}
                        keyboardType="default"
                        placeholder="Password"
                        placeholderTextColor="#6c757d"
                        maxLength={6}
                        onChangeText={text => this.setState({password: text})}
                        style={styles.input}
                        value={this.state.password}
                      />
                    </View>
                  </Form>
                </Content>
              </CardItem>

              <CardItem footer style={styles.carditem}>
                <Button
                  block
                  disabled={this.state.buttonLoading}
                  backgroundColor="#0466c8"
                  style={styles.loginButton}
                  onPress={() => this.submit()}>
                  {this.state.success === true ? (
                    <View style={{height: 36, width: 36}}>
                      <LottieView
                        source={require('../json/success.json')}
                        autoPlay
                      />
                    </View>
                  ) : (
                    <Text style={styles.loginButtonText}>Login</Text>
                  )}
                </Button>
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
          <CardItem
            footer
            style={[styles.carditem, {justifyContent: 'center'}]}>
            <Text style={styles.signupText}>
              New to Mango Network?{'  '}
              <Text
                style={[
                  styles.signupText,
                  {
                    color: '#184e77',
                    fontFamily: 'Montserrat-Bold',
                  },
                ]}
                onPress={() => this.props.navigation.navigate('SignUp')}>
                Register
              </Text>
            </Text>
          </CardItem>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  logoView: {
    flex: 1,
    height: 268,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    color: '#212529',
    marginBottom: 24,
    fontSize: 30,
    letterSpacing: -1,
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
    marginTop: 40,
  },
  cardFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signupText: {
    color: '#6c757d',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  carditem: {
    backgroundColor: '#fff',
  },
  carditemSignUpAndForgot: {
    marginTop: 25,
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
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
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
  loginButton: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#f1faee',
    textTransform: 'capitalize',
  },
});
