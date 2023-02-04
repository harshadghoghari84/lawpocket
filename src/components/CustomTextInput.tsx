import * as React from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';

export interface CustomTxtInputProps extends TextInputProps {
  forgotPassword?: boolean;
  icon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  onPress?: () => void;
  touched?: boolean;
  error?: string;
}

export const CustomTxtInput = React.forwardRef<TextInput, CustomTxtInputProps>(
  ({ ...props }, ref) => {
    const styles = useStyles();
    const { theme } = useTheme();
    return (
      <View style={styles.textInCont}>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={-200}
          style={styles.txtInCont}
        >
          <View style={styles.vTxtInCont}>
            <View style={styles.iconInputCont}>
              {props.icon ? props.icon : null}
              <TextInput
                ref={ref}
                placeholderTextColor={theme.colors.grey}
                style={styles.txtInStyle}
                onChangeText={props.onChangeText}
                value={props.value}
                selectionColor={theme.colors.textPrimary}
                {...props}
              />
            </View>
            {props.forgotPassword ? (
              <TouchableOpacity
                style={styles.forgotCont}
                onPress={props.onPress}
              >
                <Text style={styles.txtForgot}>Forgot?</Text>
              </TouchableOpacity>
            ) : null}
            {props.rightIcon ? (
              <TouchableOpacity
                // style={styles.rightIconCont}
                onPress={props.onPress}
              >
                {props.rightIcon}
              </TouchableOpacity>
            ) : null}
          </View>
        </KeyboardAvoidingView>
        {props.touched && props.error && (
          <Text style={styles.error}>{props.error}</Text>
        )}
      </View>
    );
  },
);

export const useStyles = makeStyles(theme => ({
  txtInCont: {
    height: 50,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.textInBgColor,
    borderRadius: theme.borderRadii.m,
    paddingHorizontal: theme.spacing.m,
  },
  vTxtInCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtInStyle: {
    paddingLeft: theme.spacing.m - 6,
    flex: 1,
    height: 40,
    color: theme.colors.textPrimary,
  },
  forgotCont: {
    position: 'absolute',
    right: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtForgot: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  iconInputCont: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  error: {
    marginLeft: theme.spacing.s - 4,
    marginTop: theme.spacing.s - 2,
    fontSize: theme.fontSize.m - 4,
    color: theme.colors.error,
  },
  textInCont: {
    marginVertical: theme.spacing.m - 6,
  },
}));
