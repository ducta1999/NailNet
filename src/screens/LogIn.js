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
            <Thumbnail
              source={require('../icons/nailtalkpro.png')}
              style={styles.logo}
            />
          </View>
          {this.state.loading == false ? (
            <Card transparent>
              <CardItem style={styles.carditem}>
                <Content>
                  <Form>
                    <Item style={styles.item}>
                      <Input
                        placeholder="Email..."
                        placeholderTextColor="#ced4da"
                        onChangeText={text => this.setState({email: text})}
                        style={styles.input}
                        value={this.state.email}
                      />
                    </Item>

                    <Item style={[styles.item, {marginBottom: 0}]}>
                      <Input
                        secureTextEntry={true}
                        keyboardType="default"
                        placeholder="Password..."
                        placeholderTextColor="#ced4da"
                        maxLength={6}
                        onChangeText={text => this.setState({password: text})}
                        style={styles.input}
                        value={this.state.password}
                      />
                    </Item>
                  </Form>
                </Content>
              </CardItem>

              <CardItem footer style={styles.carditem}>
                <Button
                  block
                  disabled={this.state.buttonLoading}
                  backgroundColor="#1d3557"
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
                    <Text style={styles.loginButtonText}>LOGIN</Text>
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
              Don't have an account?{'  '}
              <Text
                style={[
                  styles.signupText,
                  {
                    color: '#a8dadc',
                    fontFamily: 'Montserrat-MediumItalic',
                  },
                ]}
                onPress={() => this.props.navigation.navigate('SignUp')}>
                SignUp here
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
    // marginTop: 40,
    marginBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d3557',
    borderBottomRightRadius: 68,
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
    color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  forgotPassword: {
    color: 'white',
    // flex: 1,
    // flexDirection: "row",
    // justifyContent: "flex-end",
    //right: -60,
    fontSize: 15,
  },

  carditem: {
    backgroundColor: '#457b9d',
  },
  carditemSignUpAndForgot: {
    marginTop: 25,
  },
  item: {
    marginBottom: 20,
    marginLeft: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  container: {
    backgroundColor: '#457b9d',
    flex: 1,
  },
  card: {
    backgroundColor: '#457b9d',
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
  loginButton: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 4,
  },
  loginButtonText: {
    fontSize: 17,
    fontFamily: 'Montserrat-Bold',
    color: '#f1faee',
  },
});
