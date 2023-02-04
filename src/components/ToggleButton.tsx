import * as React from 'react';
import { makeStyles, useTheme } from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native';

interface ToggleButtonProps {
  isOn?: boolean;
  onToggle?: (val: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOn, onToggle }) => {
  const { theme } = useTheme();
  const styles = useStyles();
  return (
    <ToggleSwitch
      isOn={isOn}
      onColor={theme.colors.transparent}
      offColor={theme.colors.transparent}
      thumbOnStyle={{ backgroundColor: theme.colors.primary }}
      thumbOffStyle={{ backgroundColor: theme.colors.grey }}
      trackOnStyle={styles.trackStyle}
      trackOffStyle={styles.trackStyle}
      size="medium"
      onToggle={onToggle}
    />
  );
};

const useStyles = makeStyles(theme => ({
  switch: {
    transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],
    borderColor: theme.colors.grey,
    borderWidth: 1,
    borderRadius: theme.borderRadii.l,
  },
  trackStyle: {
    borderColor: theme.colors.grey4,
    borderWidth: 1,
    borderRadius: theme.borderRadii.l,
  },
}));

export default ToggleButton;
