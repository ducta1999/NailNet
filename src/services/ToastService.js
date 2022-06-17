import {Toast} from 'native-base';

export const success = message => {
  Toast.show({
    text: message,
    buttonText: 'Okay',
    duration: 5000,
    position: 'bottom',
    type: 'success',
  });
};

export const error = message => {
  Toast.show({
    text: message,
    buttonText: 'Okay',
    duration: 5000,
    position: 'bottom',
    type: 'danger',
  });
};
