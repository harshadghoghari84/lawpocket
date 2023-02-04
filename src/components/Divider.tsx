import * as React from 'react';
import { View, ViewStyle } from 'react-native';
import { makeStyles } from 'react-native-elements';
interface DividerProps {
  style?: ViewStyle;
}
export const Divider: React.FC<DividerProps> = ({ style }) => {
  const styles = useStyles();
  return <View style={[styles.dividerCont, style && style]} />;
};

const useStyles = makeStyles(theme => ({
  dividerCont: {
    backgroundColor: theme.colors.dividerColor,
    height: 10,
    width: '100%',
  },
}));
