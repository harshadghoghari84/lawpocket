import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

// relative path

interface ButtonProps {
  name: string;
  borderBtn?: boolean;
  smallBtn?: number;
  height?: number;
  borderRadius?: number;
  onPress: () => void;
  bgc?: string;
  txtColor?: string;
  icon?: React.ReactElement;
  loading?: boolean;
  disabled?: boolean;
}
const CustomButton: React.FC<ButtonProps> = ({
  name,
  borderBtn,
  smallBtn,
  height,
  borderRadius,
  onPress,
  bgc,
  txtColor,
  icon,
  loading,
  disabled,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      {borderBtn ? (
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.6}
          onPress={onPress}
          style={[
            styles.borderBtnContainer,
            smallBtn && { width: smallBtn },
            height && { height: height },
            borderRadius && { borderRadius: borderRadius },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.loaderColor} />
          ) : (
            <>
              {icon && icon}
              <Text style={[styles.text, { color: theme.colors.textPrimary }]}>
                {t(`${name}`)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.6}
          onPress={onPress}
          style={[
            styles.shadowStyle,
            borderRadius && { borderRadius: borderRadius },
          ]}
        >
          <LinearGradient
            style={[
              styles.container,
              smallBtn && { width: smallBtn },
              height && { height: height },
              borderRadius && { borderRadius: borderRadius },
            ]}
            colors={
              bgc
                ? [bgc, bgc]
                : disabled || loading
                ? [theme.colors.grey, theme.colors.grey]
                : [theme.colors.gradientSecond, theme.colors.gradientPrime]
            }
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.loaderColor} />
            ) : (
              <>
                {icon && icon}
                <Text style={[styles.text, txtColor && { color: txtColor }]}>
                  {t(`${name}`)}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    height: 45,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    color: theme.colors?.white,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
  },
  borderBtnContainer: {
    height: 45,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  shadowStyle: {
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    backgroundColor: theme.colors.transparent,
    borderRadius: theme.borderRadii.m,
  },
}));

export default CustomButton;
