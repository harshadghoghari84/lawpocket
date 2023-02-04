import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import CustomHeader from 'src/components/CustomHeader';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import { Divider } from 'src/components/Divider';
import LawyerItem from 'src/components/LawyerItem';
import SearchIcon from 'src/components/svg/SearchIcon';
import { NoDataFound } from 'src/components/ui/NoDataFound';
// import { LawyersData } from 'src/helper/DummyData';
import { Route } from 'src/constants/navigationConstants';
import { useLawyers } from 'src/hooks/useLawyers';
import { selectFilterLawyer } from 'src/redux/settings/settings.selectors';
import { ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';

const Lawyers: React.FC<MainNavigationProps<Route.navLawyers>> = ({
  navigation,
}) => {
  // const { isFilter = false } = route?.params;
  const { state, city, practiceArea, caseFile } =
    useSelector(selectFilterLawyer);
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const { theme } = useTheme();

  const [value, setValue] = React.useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: LawyersData,
    refetch,
    isLoading,
    isRefetching,
  } = useLawyers(state, city, practiceArea, caseFile);

  console.log('LawyersData', LawyersData);

  React.useEffect(() => {
    refetch().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, practiceArea]);

  let filtered_Lawyers = LawyersData?.filter(item => {
    return item.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1;
  });

  const pullToRefreshData = () => {
    setRefreshing(true);
    refetch().then();
  };

  useEffect(() => {
    if (!isRefetching && refreshing) {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [refreshing, isRefetching]);

  return (
    <View style={styles.container}>
      <CustomHeader
        backBtn={true}
        title={'Attorneys'}
        right={
          <TouchableOpacity
            style={styles.filterIconCont}
            onPress={() => navigation.navigate(Route.navFilterLawyers)}
          >
            <FontAwesome
              name="filter"
              size={20}
              color={theme.colors.iconColor}
            />
          </TouchableOpacity>
        }
      />
      <View style={styles.textInCont}>
        <CustomTxtInput
          placeholder="Search Attorneys"
          icon={<SearchIcon color={theme.colors.primary} />}
          value={value}
          onChangeText={val => setValue(val)}
        />
      </View>
      {filtered_Lawyers?.length > 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.refreshLoaderColor}
              refreshing={refreshing}
              onRefresh={pullToRefreshData}
            />
          }
          showsVerticalScrollIndicator={false}
          data={filtered_Lawyers}
          contentContainerStyle={styles.scrollCont}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => {
            return <LawyerItem item={item} />;
          }}
        />
      ) : (
        <NoDataFound
          loading={isLoading}
          noDataText={'No attorney!'}
          noDataIcon={
            <Image
              source={require('src/helper/image/noData.png')}
              style={styles.noDataIcons}
            />
          }
        />
      )}
    </View>
  );
};

export default Lawyers;

export const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  scrollCont: { flexGrow: 1 },
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
  filterIconCont: {
    paddingHorizontal: theme.spacing.s + 3,
    paddingVertical: theme.spacing.s,
  },
  noDataIcons: {
    height: 70,
    width: 70,
  },
}));
