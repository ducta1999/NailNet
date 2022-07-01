import React, {useEffect, useState} from 'react';
import LottieView from 'lottie-react-native';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

const ExplodingHeart = ({
  onPress = () => {},
  onChange = () => {},
  status = false,
  width = 48,
  containerStyle,
  type = 'heart',
  onAnimationFinish = () => {},
  ...props
}) => {
  const [isFavorite, setFavorite] = useState(status);
  const [animation, setAnimation] = useState(null);

  const lottieFile = {
    heart: require('../../json/heart.json'),
  };
  useEffect(() => {
    if (isFavorite) {
      animation?.play();
    } else animation?.reset();
  }, [isFavorite, animation]);

  useEffect(() => {
    setFavorite(status);
  }, [status]);

  const toggleStatus = () => {
    if (onChange) onChange(!isFavorite);
    setFavorite(!isFavorite);
  };

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        onPress={() => {
          onPress();
          toggleStatus();
        }}
        {...props}>
        <LottieView
          autoPlay={false}
          loop={false}
          resizeMode="contain"
          style={{width}}
          ref={animation => setAnimation(animation)}
          source={lottieFile[type]}
          onAnimationFinish={() => onAnimationFinish()}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ExplodingHeart;

ExplodingHeart.propTypes = {
  onChange: PropTypes.func,
  containerStyle: PropTypes.object,
  status: PropTypes.bool,
  width: PropTypes.number,
};

ExplodingHeart.defaultProps = {
  status: false,
  onChange: null,
  width: 60,
  containerStyle: null,
};
