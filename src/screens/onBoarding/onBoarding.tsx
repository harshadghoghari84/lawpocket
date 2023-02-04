import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  SafeAreaView,
  View,
  ViewToken,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
// relative path
import CustomButton from 'src/components/CustomButton';
import { ASPECT_RATIO, WIDTH } from 'src/constants';
import { Route } from 'src/constants/navigationConstants';
import { MainNavigationProps } from 'src/types/navigation.types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { createArrayUseNumber } from 'src/utils/common';
import SliderItem from 'src/components/on-boarding/SliderItem';
import Paginator from 'src/components/ui/Paginator';
import { setOpenFirstTime } from 'src/utils/asyncStorage';
import LinearGradient from 'react-native-linear-gradient';
import { SLIDER } from 'src/data/Common';

const { width: wWidth } = Dimensions.get('window');

const OnBoarding: React.FC<MainNavigationProps<Route.navOnBoarding>> = ({
  navigation,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const sliderRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    setOpenFirstTime().then();
  }, []);

  // handle hardware back button click
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (currentSlide === 0) {
          return false;
        } else {
          sliderRef.current?.scrollToOffset({
            offset: (currentSlide - 1) * wWidth,
            animated: true,
          });
          setCurrentSlide(pv => pv - 1);
          return true;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [currentSlide]),
  );

  // scroll to next slide
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const nextSlide = async () => {
    if (currentSlide < SLIDER.length - 1) {
      sliderRef.current?.scrollToIndex({ index: currentSlide + 1 });
    } else {
      sliderRef.current?.scrollToIndex({ index: 0 });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide().then();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [nextSlide]);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setCurrentSlide(viewableItems[0].index);
    },
  ).current;

  const openAuthFlow = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Route.navAuthentication }],
      }),
    );
  };

  return (
    <>
      <SafeAreaView style={styles.topSafeAreaView} />
      <LinearGradient
        style={styles.lgCont}
        // colors={[theme.colors.white, theme.colors.tabBgColor]}
        colors={[
          theme.colors.bgcFirstGradientColor,
          theme.colors.bgcSecondGradientColor,
        ]}
      >
        <View style={styles.mainCont}>
          <Animated.FlatList
            ref={sliderRef}
            style={styles.listContainer}
            contentContainerStyle={styles.fltCont}
            horizontal={true}
            data={SLIDER}
            pagingEnabled={true}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={viewableItemChanged}
            viewabilityConfig={viewConfig}
            keyExtractor={(_item, index) => index.toString()}
            scrollEventThrottle={32}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: { contentOffset: { x: scrollX } },
                },
              ],
              { useNativeDriver: false },
            )}
            renderItem={item => <SliderItem item={item.item} />}
          />
          <View style={styles.subContainer}>
            <Paginator
              data={createArrayUseNumber(SLIDER.length)}
              scrollX={scrollX}
              variant={'secondary'}
            />
          </View>
          <View style={styles.bottomCont}>
            <CustomButton
              height={45}
              smallBtn={WIDTH - 60}
              borderBtn={false}
              name={'Get Started'}
              onPress={openAuthFlow}
            />
          </View>
        </View>
      </LinearGradient>
      <SafeAreaView style={styles.bottomSafeAreaView} />
    </>
  );
};

export default OnBoarding;

export const useStyles = makeStyles(theme => ({
  bottomSafeAreaView: {
    flex: 0,
    backgroundColor: theme.colors.bottomSafeAreaViewColor,
  },
  lgCont: { flex: 1 },
  mainCont: { flex: 1, alignItems: 'center' },
  topSafeAreaView: {
    flex: 0,
    zIndex: 999,
    backgroundColor: theme.colors.background,
  },
  listContainer: { flex: 0.7 },
  subContainer: {
    flex: 0.3,
    paddingHorizontal: theme.spacing.l * ASPECT_RATIO,
  },
  bottomCont: {
    paddingBottom: theme.spacing.m,
  },
  fltCont: { alignItems: 'center' },
}));
