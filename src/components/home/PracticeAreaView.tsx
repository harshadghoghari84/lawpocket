import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { makeStyles } from 'react-native-elements';
import { selectedFilterLawyer } from 'src/redux/settings/settings.slice';
import { GetAreaOfLawProps } from 'src/types/setProfile.types';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useNavigation } from '@react-navigation/native';
import { Route } from 'src/constants/navigationConstants';

interface PracticeAreaProps {
  data: GetAreaOfLawProps;
}

const PracticeAreaView: React.FC<PracticeAreaProps> = ({ data }) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const styles = useStyles();

  const openLawyerListing = () => {
    dispatch(
      selectedFilterLawyer({
        state: '',
        practiceArea: `[${data.id}]`,
      }),
    );
    navigation.navigate({
      name: Route.navLawyers as never,
      params: {} as never,
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={openLawyerListing}
    >
      <View style={styles.mainContainer}>
        <Text numberOfLines={1} style={styles.headerText}>
          {data.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: 40,
    backgroundColor: theme.colors.primaryLightest,
    borderRadius: theme.borderRadii.s + 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.s,
    margin: theme.spacing.s - 2,
  },
  headerText: {
    fontSize: theme.fontSize.m + 2,
    color: theme.colors.primary,
  },
  container: {
    marginLeft: theme.spacing.m,
  },
}));

export default PracticeAreaView;
