import { AsyncStorage } from "react-native";
import * as constant from "./Constant";

export const updateAccount = async res => {
  await AsyncStorage.removeItem(constant.CURRENT_USER);

  res.cityConfirm = false;
  res.checkCityConfirm = false;

  await AsyncStorage.setItem(constant.CURRENT_USER, JSON.stringify(res));
  await AsyncStorage.setItem(constant.LAST_USER, res.email);
};

export const updateAccountWithNewLocation = async location => {
  var data = JSON.parse(await AsyncStorage.getItem(constant.CURRENT_USER));

  data.city = location;

  await AsyncStorage.removeItem(constant.CURRENT_USER);
  await AsyncStorage.setItem(constant.CURRENT_USER, JSON.stringify(data));
};

export const updateAccountWithcheckCityConfirm = async cityConfirm => {
  var data = JSON.parse(await AsyncStorage.getItem(constant.CURRENT_USER));

  data.cityConfirm = cityConfirm;
  data.checkCityConfirm = true;

  await AsyncStorage.removeItem(constant.CURRENT_USER);
  await AsyncStorage.setItem(constant.CURRENT_USER, JSON.stringify(data));
};

export const removeAccount = async () => {
  await AsyncStorage.removeItem(constant.CURRENT_USER);
};

export const checkAccountExisted = async () => {
  var user = await AsyncStorage.getItem(constant.CURRENT_USER);
  if (user == null) {
    return false;
  } else {
    return true;
  }
};

export const isExpired = async () => {
  const user = await getLoggedInUser();

  if (user.access_token == "") {
    return true;
  } else if (new Date(user.expires) > new Date()) {
    return false;
  } else {
    return true;
  }
};

export const getToken = async () => {
  var token = await AsyncStorage.getItem("fcmToken");
  return token;
};

export const getLastLoggedInUserEmail = async () => {
  return await AsyncStorage.getItem(constant.LAST_USER);
};

export const getLoggedInUser = async () => {
  var user = {
    access_token: "",
    email: "",
    role: "",
    userName: "",
    expires: "",
    fullName: "",
    departmentId: "",
    city: "",
    cityConfirm: false,
    checkCityConfirm: false,
    occupationID: null
  };
  if (await checkAccountExisted()) {
    var userData = JSON.parse(
      await AsyncStorage.getItem(constant.CURRENT_USER)
    );

    return userData;
  } else {
    return user;
  }
};
