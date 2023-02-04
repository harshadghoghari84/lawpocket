import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { makeStyles } from 'react-native-elements';
import { ASPECT_RATIO } from 'src/constants';
import { SliderItemProps } from 'src/types/slider.type';
import LottieView from 'lottie-react-native';

const { width: windowWidth } = Dimensions.get('window');

interface SliderProps {
  item: SliderItemProps;
}

const SliderItem: React.FC<SliderProps> = ({ item }) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/*<Image source={item.image} style={styles.sliderImage} />*/}
        <LottieView
          style={styles.sliderImage}
          source={require('src/helper/on-boarding.json')}
          autoPlay
          loop
        />
      </View>
      <Text style={styles.headerText}>{item.headerText} </Text>
      <Text style={styles.descriptionText}>{item.description} </Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    width: windowWidth,
    alignItems: 'center',
    padding: theme.spacing.l * ASPECT_RATIO,
  },
  imageContainer: {
    paddingVertical: theme.spacing.xl * ASPECT_RATIO,
  },
  sliderImage: {
    width: 160 * ASPECT_RATIO,
    height: 160 * ASPECT_RATIO,
  },
  headerText: {
    fontSize: (theme.fontSize.l - 2) * ASPECT_RATIO,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: theme.fontSize.m * ASPECT_RATIO,
    lineHeight: 24,
    fontWeight: '400',
    textAlign: 'center',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.l - 5 * ASPECT_RATIO,
  },
}));

export default SliderItem;
