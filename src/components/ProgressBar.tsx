import React from 'react';
import { Animated, View } from 'react-native';
import { makeStyles } from 'react-native-elements';

export interface ProgressBarProps {
  count: number;
  totalCount: number;
  height: number;
  color: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = props => {
  const { count, height } = props;
  const styles = useStyles();

  return (
    <>
      <View style={[styles.progressBg, { height: height }]}>
        <Animated.View
          style={[
            styles.animatedProgress,
            { height: height, width: `${count}%` },
          ]}
        />
      </View>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  text: {
    color: theme.colors?.primary,
  },
  progressBg: {
    backgroundColor: theme.colors.progressBarBgColor,
    borderRadius: 20,
    // overflow: 'hidden',
    // width: '100%',
  },
  animatedProgress: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    // overflow: 'hidden',
    // position: 'absolute',
    // transform: [{translateX: animatedvalue}],
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
}));
