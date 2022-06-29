import React from 'react';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';

export default function Loading() {
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
      }}>
      <View style={{height: 168}}>
        <LottieView source={require('../../json/loading.json')} autoPlay loop />
      </View>
    </View>
  );
}
