/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer,
  NavigationActions,
} from 'react-navigation';
import {Provider} from 'react-redux';
import configureStore from './src/store/configureStore';
import LogIn from './src/screens/LogIn';
import Menu from './src/screens/Menu';
import SignUp from './src/screens/SignUp';
import Home from './src/screens/Home';
import Question from './src/screens/Question';
import Shop from './src/screens/Shop';
import AddQuestionPublic from './src/screens/questionSubScreens/AddQuestionPublic';
import DoctorDetail from './src/screens/questionSubScreens/DoctorDetail';
import QuestionDetail from './src/screens/questionSubScreens/QuestionDetail';
import AddAnswer from './src/screens/questionSubScreens/AddAnswer';
import {Root} from 'native-base';
import Promotion from './src/screens/Promotion';
import Profile from './src/screens/Profile';
import AddPromotion from './src/screens/promotionSubScreens/AddPromotion';
import PromotionDetail from './src/screens/promotionSubScreens/PromotionDetail';
import AddProduct from './src/screens/shopSubScreens/AddProduct';
import ProductDetail from './src/screens/shopSubScreens/ProductDetail';
import Classified from './src/screens/Classified';
import AddClassified from './src/screens/classifiedSubScreens/AddClassified';
import ClassifiedDetail from './src/screens/classifiedSubScreens/ClassifiedDetail';
import Job from './src/screens/Job';
import JobDetail from './src/screens/jobSubScreens/JobDetail';
import AddJob from './src/screens/jobSubScreens/AddJob';
import Config from './src/screens/Config';
import UserDetail from './src/screens/configSubScreens/UserDetail';
import PromotionConfigDetail from './src/screens/configSubScreens/PromotionConfigDetail';
import QuestionConfigDetail from './src/screens/configSubScreens/QuestionConfigDetail';
import JobConfigDetail from './src/screens/configSubScreens/JobConfigDetail';
import ShopConfigDetail from './src/screens/configSubScreens/ShopConfigDetail';
import ClassifiedConfigDetail from './src/screens/configSubScreens/ClassifiedConfigDetail';
import NailTVConfigDetail from './src/screens/configSubScreens/NailTVConfigDetail';
import NailTV from './src/screens/NailTV';
import AddNailTV from './src/screens/nailtvSubScreens/AddNailTV';
import NailTVDetail from './src/screens/nailtvSubScreens/NailTVDetail';
import Chat from './src/screens/Chat';
import Conversation from './src/screens/Conversation';
import Post from './src/screens/Post';
import QuestionPostDetail from './src/screens/postSubScreens/QuestionPostDetail';
import PromotionPostDetail from './src/screens/postSubScreens/PromotionPostDetail';
import JobPostDetail from './src/screens/postSubScreens/JobPostDetail';
import ShopPostDetail from './src/screens/postSubScreens/ShopPostDetail';
import ClassifiedPostDetail from './src/screens/postSubScreens/ClassifiedPostDetail';
import NailTVPostDetail from './src/screens/postSubScreens/NailTVPostDetail';
import Admin from './src/screens/Admin';
import QuestionAdminAdd from './src/screens/adminSubScreens/QuestionAdminAdd';
import PromotionAdminAdd from './src/screens/adminSubScreens/PromotionAdminAdd';
import JobAdminAdd from './src/screens/adminSubScreens/JobAdminAdd';
import ShopAdminAdd from './src/screens/adminSubScreens/ShopAdminAdd';
import ClassifiedAdminAdd from './src/screens/adminSubScreens/ClassifiedAdminAdd';
// const instructions = Platform.select({
//   ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
//   android:
//     "Double tap R on your keyboard to reload,\n" +
//     "Shake or press menu button for dev menu"
// });
import AnimatedSplash from 'react-native-animated-splash-screen';

const StackNavigator = createStackNavigator({
  LogIn: {
    screen: LogIn,
    navigationOptions: {
      header: null,
    },
  },
  Question: {
    screen: Question,
    navigationOptions: {
      header: null,
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      header: null,
    },
  },
  Admin: {
    screen: Admin,
    navigationOptions: {
      header: null,
    },
  },
  ClassifiedAdminAdd: {
    screen: ClassifiedAdminAdd,
    navigationOptions: {
      header: null,
    },
  },
  ShopAdminAdd: {
    screen: ShopAdminAdd,
    navigationOptions: {
      header: null,
    },
  },
  JobAdminAdd: {
    screen: JobAdminAdd,
    navigationOptions: {
      header: null,
    },
  },
  PromotionAdminAdd: {
    screen: PromotionAdminAdd,
    navigationOptions: {
      header: null,
    },
  },
  QuestionAdminAdd: {
    screen: QuestionAdminAdd,
    navigationOptions: {
      header: null,
    },
  },
  Post: {
    screen: Post,
    navigationOptions: {
      header: null,
    },
  },
  NailTV: {
    screen: NailTV,
    navigationOptions: {
      header: null,
    },
  },
  Config: {
    screen: Config,
    navigationOptions: {
      header: null,
    },
  },
  Conversation: {
    screen: Conversation,
    navigationOptions: {
      header: null,
    },
  },
  Classified: {
    screen: Classified,
    navigationOptions: {
      header: null,
    },
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      header: null,
    },
  },
  NailTVDetail: {
    screen: NailTVDetail,
    navigationOptions: {
      header: null,
    },
  },
  AddNailTV: {
    screen: AddNailTV,
    navigationOptions: {
      header: null,
    },
  },
  NailTVConfigDetail: {
    screen: NailTVConfigDetail,
    navigationOptions: {
      header: null,
    },
  },
  NailTVPostDetail: {
    screen: NailTVPostDetail,
    navigationOptions: {
      header: null,
    },
  },
  ClassifiedConfigDetail: {
    screen: ClassifiedConfigDetail,
    navigationOptions: {
      header: null,
    },
  },
  ClassifiedPostDetail: {
    screen: ClassifiedPostDetail,
    navigationOptions: {
      header: null,
    },
  },
  ShopConfigDetail: {
    screen: ShopConfigDetail,
    navigationOptions: {
      header: null,
    },
  },
  ShopPostDetail: {
    screen: ShopPostDetail,
    navigationOptions: {
      header: null,
    },
  },
  JobPostDetail: {
    screen: JobPostDetail,
    navigationOptions: {
      header: null,
    },
  },
  JobConfigDetail: {
    screen: JobConfigDetail,
    navigationOptions: {
      header: null,
    },
  },
  UserDetail: {
    screen: UserDetail,
    navigationOptions: {
      header: null,
    },
  },
  QuestionConfigDetail: {
    screen: QuestionConfigDetail,
    navigationOptions: {
      header: null,
    },
  },
  QuestionPostDetail: {
    screen: QuestionPostDetail,
    navigationOptions: {
      header: null,
    },
  },
  PromotionConfigDetail: {
    screen: PromotionConfigDetail,
    navigationOptions: {
      header: null,
    },
  },
  PromotionPostDetail: {
    screen: PromotionPostDetail,
    navigationOptions: {
      header: null,
    },
  },
  Job: {
    screen: Job,
    navigationOptions: {
      header: null,
    },
  },
  AddJob: {
    screen: AddJob,
    navigationOptions: {
      header: null,
    },
  },
  JobDetail: {
    screen: JobDetail,
    navigationOptions: {
      header: null,
    },
  },
  AddClassified: {
    screen: AddClassified,
    navigationOptions: {
      header: null,
    },
  },
  ClassifiedDetail: {
    screen: ClassifiedDetail,
    navigationOptions: {
      header: null,
    },
  },
  Shop: {
    screen: Shop,
    navigationOptions: {
      header: null,
    },
  },
  Promotion: {
    screen: Promotion,
    navigationOptions: {
      header: null,
    },
  },
  Home: {
    screen: Home,
    navigationOptions: {
      header: null,
    },
  },
  AddProduct: {
    screen: AddProduct,
    navigationOptions: {
      header: null,
    },
  },
  ProductDetail: {
    screen: ProductDetail,
    navigationOptions: {
      header: null,
    },
  },
  Shop: {
    screen: Shop,
    navigationOptions: {
      header: null,
    },
  },
  AddQuestionPublic: {
    screen: AddQuestionPublic,
    navigationOptions: {
      header: null,
    },
  },
  AddPromotion: {
    screen: AddPromotion,
    navigationOptions: {
      header: null,
    },
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null,
    },
  },
  PromotionDetail: {
    screen: PromotionDetail,
    navigationOptions: {
      header: null,
    },
  },
  QuestionDetail: {
    screen: QuestionDetail,
    navigationOptions: {
      header: null,
    },
  },
  AddAnswer: {
    screen: AddAnswer,
    navigationOptions: {
      header: null,
    },
  },
  DoctorDetail: {
    screen: DoctorDetail,
    navigationOptions: {
      header: null,
    },
  },
});

export const SideMenu = createDrawerNavigator(
  {
    Stack: {
      screen: StackNavigator,
    },
  },
  {
    drawerWidth: 230,
    overlayColor: '#00000099',
    contentComponent: props => <Menu {...props} />,
  },
);

const AppContainer = createAppContainer(SideMenu);

// type Props = {};
const store = configureStore();
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root>
          <AppContainer />
        </Root>
      </Provider>
    );
  }
}
