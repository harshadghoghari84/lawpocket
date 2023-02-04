import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import CustomHeader from 'src/components/CustomHeader';
import { ASPECT_RATIO } from 'src/constants';

interface NoDataFoundProps {
  style?: ViewStyle;
  loading?: boolean;
  onPress?: () => void;
  noDataIcon?: React.ReactElement;
  noDataText?: string;
  isHeader?: boolean;
}
export const NoDataFound: React.FC<NoDataFoundProps> = ({
  style,
  loading,
  onPress,
  noDataIcon,
  noDataText,
  isHeader,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  return (
    <>
      {!loading && isHeader ? <CustomHeader backBtn={true} /> : null}

      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={[styles.dividerCont, style && style]}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          // <NoDataFoundIcon />
          <View style={styles.noDataView}>
            {noDataIcon}
            <Text style={styles.txtNodataFound}>{noDataText}</Text>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  dividerCont: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtNodataFound: {
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.m,
  },
  noDataAnim: {
    width: 200 * ASPECT_RATIO,
    height: 200 * ASPECT_RATIO,
  },
  noDataView: {
    width: 200 * ASPECT_RATIO,
    height: 200 * ASPECT_RATIO,
    backgroundColor: theme.colors.notificationBackColor,
    borderRadius: (200 * ASPECT_RATIO) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
