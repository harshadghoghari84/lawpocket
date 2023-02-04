import * as React from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomHeader from 'src/components/CustomHeader';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import SearchIcon from 'src/components/svg/SearchIcon';
import { Route } from 'src/constants/navigationConstants';
import { lawTypeData } from 'src/helper/DummyData';
import { MainNavigationProps } from 'src/types/navigation.types';

const FindLawyers: React.FC<MainNavigationProps<Route.navFindLawyer>> = ({
  navigation,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [value, setValue] = React.useState<string>('');

  let filtered_Lawyers = lawTypeData.filter(item => {
    return item.lawType.toLowerCase().indexOf(value.toLowerCase()) > -1;
  });
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader backBtn={true} title={'Find attorneys'} dummy={true} />
      <View style={styles.textInCont}>
        <CustomTxtInput
          placeholder="Search attorneys"
          icon={<SearchIcon color={theme.colors.primary} />}
          value={value}
          onChangeText={val => setValue(val)}
        />
      </View>
      {filtered_Lawyers.length > 0 ? (
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={filtered_Lawyers}
          contentContainerStyle={styles.scrollCont}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(Route.navLawyers);
                }}
                style={styles.selectStateCont}
              >
                <Text style={styles.txtLawType}>{item.lawType}</Text>
                <Entypo
                  name="chevron-thin-right"
                  size={18}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.noDataFoundCont}>
          <Text style={styles.txtNoDataFound}>no data found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FindLawyers;

export const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  scrollCont: { flexGrow: 1, marginHorizontal: theme.spacing.m },
  textInCont: {
    marginHorizontal: theme.spacing.m,
  },
  divider: {
    marginVertical: theme.spacing.s,
  },
  noDataFoundCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtNoDataFound: {
    color: theme.colors.textPrimary,
  },
  selectStateCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
  },
  txtLawType: {
    color: theme.colors.textSecondary,
  },
}));
