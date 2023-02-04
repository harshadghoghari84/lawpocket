import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { makeStyles } from 'react-native-elements';
import { FirstCharText } from 'src/utils/common';

export interface NameFirstCharProps {
  name: string;
  size?: number;
  fontSize?: number;
  style?: ViewStyle;
}
export const NameFirstChar: React.FC<NameFirstCharProps> = props => {
  const styles = useStyles();

  return (
    <View
      style={[
        styles.profileImg,
        props.size && {
          height: props.size,
          width: props.size,
          borderRadius: props.size,
        },
        props.style && props.style,
      ]}
    >
      <Text
        style={[
          styles.txtName,
          props.size && styles.fontSize,
          props.fontSize && { fontSize: props.fontSize },
        ]}
      >
        {FirstCharText(props.name)}
      </Text>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.xl,
    backgroundColor: theme.colors.textInBgColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtName: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  fontSize: {
    fontSize: theme.fontSize.m - 2,
  },
}));
