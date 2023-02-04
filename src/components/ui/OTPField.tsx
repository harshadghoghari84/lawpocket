import OTPInputView from '@twotalltotems/react-native-otp-input/dist';
import React from 'react';
import { View, Text } from 'react-native';
import { makeStyles } from 'react-native-elements';

interface OtpFieldProps {
  value: string;
  handleChange: (code: string) => void;
  error: string;
  touched: boolean;
  onCodeFilled?: () => void;
}

const OtpField = React.forwardRef<OTPInputView, OtpFieldProps>(
  ({ value, handleChange, error, touched, onCodeFilled }, ref) => {
    const styles = useStyles();

    return (
      <View style={styles.container}>
        <OTPInputView
          ref={ref}
          style={styles.otp}
          pinCount={6}
          code={value}
          onCodeChanged={handleChange}
          // secureTextEntry
          codeInputFieldStyle={styles.otpInput}
          codeInputHighlightStyle={styles.otpInputHighlight}
          autoFocusOnLoad={false}
          keyboardType="number-pad"
          onCodeFilled={() => {
            onCodeFilled && onCodeFilled();
          }}
        />
        {!!error && touched && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  },
);

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  otp: {
    width: '100%',
    height: 50,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderRadius: theme.borderRadii.m,
    color: theme.colors.primary,
    fontSize: theme.fontSize.m,
    backgroundColor: theme.colors.dividerColor,
  },
  otpInputHighlight: {},
  error: {
    marginTop: theme.spacing.l,
    color: theme.colors.error,
    fontSize: 12,
  },
}));

export default OtpField;
