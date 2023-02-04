import * as React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

interface ChooseItemsProps {
  title?: string;
  onPress?: () => void;
  icon?: React.ReactElement;
  secondIcon?: React.ReactElement;
  bgc?: string;
  txtColor?: string;
  disabled?: boolean;
}

const ChooseItems: React.FC<ChooseItemsProps> = ({
  bgc,
  title,
  onPress,
  icon,
  secondIcon,
  txtColor,
  disabled,
}) => {
  const { theme } = useTheme();
  const styles = useStyles();
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.6}
      style={[styles.vState, bgc && { backgroundColor: bgc }]}
    >
      <View style={styles.iconAndTxtCont}>
        {icon && icon}
        <Text
          numberOfLines={1}
          style={[styles.txt, txtColor && { color: txtColor }]}
        >
          {title}
        </Text>
      </View>
      {secondIcon ? (
        secondIcon
      ) : (
        <>
          {disabled ? (
            <ActivityIndicator color={theme.colors.grey} />
          ) : (
            <Icon name="chevron-down" size={25} color={theme.colors.grey} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  vState: {
    backgroundColor: theme.colors.textInBgColor,
    height: 50,
    borderRadius: theme.borderRadii.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m - 6,
    marginBottom: theme.spacing.l - 4,
  },
  iconAndTxtCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.m - 6,
    fontSize: theme.fontSize.m,
    width: 200,
  },
}));

export default ChooseItems;
