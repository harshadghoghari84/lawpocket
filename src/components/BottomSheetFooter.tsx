import React from 'react';
import { SafeAreaView } from 'react-native';
import { makeStyles } from 'react-native-elements';
// relative path

interface ModalFooterProps {
  backgroundColor?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ backgroundColor }) => {
  const styles = useStyles();

  return (
    <SafeAreaView
      style={[styles.safeAreaView, { backgroundColor: backgroundColor }]}
    />
  );
};

export default ModalFooter;

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
}));
