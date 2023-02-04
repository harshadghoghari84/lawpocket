import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';

interface OAuthButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  onPress,
  children,
  loading,
  disabled,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      disabled={disabled}
      onPress={onPress}
      style={styles.vSocial}
    >
      {loading ? (
        <ActivityIndicator size={16} color={theme.colors.textPrimary} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  vSocial: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.l - 4,

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.tabBgColor,
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

export default OAuthButton;
