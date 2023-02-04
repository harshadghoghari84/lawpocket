import * as React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { makeStyles } from 'react-native-elements';

type ViewAllItemContProps = {
  name?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  dataLength?: string;
};

export const ViewAllItemCont = ({
  name,
  style,
  onPress,
  dataLength,
}: ViewAllItemContProps) => {
  const styles = useStyles();
  return (
    <View style={[styles.chatAllCont, style && style]}>
      <Text style={styles.txtRecentChat}>
        {name}{' '}
        {dataLength ? (
          <Text style={styles.txtDataLength}>({dataLength})</Text>
        ) : null}
      </Text>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPress}
        style={styles.outerViewAllCont}
      >
        <Text style={styles.txtViewAll}>{'View All'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  chatAllCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.m - 6,
  },
  txtRecentChat: {
    fontSize: theme.fontSize.m + 4,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  txtViewAll: {
    fontSize: theme.fontSize.m,
    fontWeight: '600',
    color: theme.colors.primary,
    marginRight: theme.spacing.m - 6,
  },
  outerViewAllCont: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  txtDataLength: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
}));
