import moment from 'moment';
import * as React from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from 'src/components/CustomHeader';
import { Divider } from 'src/components/Divider';
import { NameFirstChar } from 'src/components/NameFirstChar';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { Route } from 'src/constants/navigationConstants';
import { useMyClients } from 'src/hooks/useMyClients';
import { ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';

const MyCustomers: React.FC<MainNavigationProps<Route.navMyCustomers>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useMyClients();

  return (
    <View style={styles.container}>
      <CustomHeader backBtn={true} title={'My Customers'} dummy={true} />
      {/* <View style={styles.reviewCont}>
        <Text style={styles.txtReviews}>
          Reviews{' '}
          <Text
            style={styles.txtInnerReviews}>{`(${data?.data?.length})`}</Text>
        </Text>
      </View> */}
      {data?.length > 0 ? (
        <FlatList
          data={data}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.refreshLoaderColor}
              refreshing={isLoading}
              onRefresh={() => refetch().then()}
            />
          }
          keyExtractor={(_item, index) => index.toString()}
          contentContainerStyle={styles.scrollCont}
          renderItem={({ item }) => {
            const name =
              item?.client?.firstName && item?.client?.lastName
                ? `${item?.client?.firstName} ${item?.client?.lastName}`
                : item?.client?.firstName
                ? `${item?.client?.firstName}`
                : item?.client?.lastName
                ? `${item?.client?.lastName}`
                : '';
            const ProfilePhoto = item?.client?.profilePhoto;
            const time = moment(item?.date?.updated).format('hh:mm A');
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.itemCont}
                onPress={() => {
                  navigation.navigate({
                    name: Route.navOtherUserProfile as never,
                    params: { id: item.client.id } as never,
                  });
                }}
              >
                {ProfilePhoto ? (
                  <Image
                    source={{ uri: ProfilePhoto }}
                    style={styles.profilePhoto}
                  />
                ) : (
                  <NameFirstChar name={name} />
                )}
                <View style={styles.nameTimeCont}>
                  <Text style={styles.txtName}>{name}</Text>
                  <Text style={styles.txtTime}>{time}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <NoDataFound
          loading={isLoading}
          noDataText={'No customers!'}
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

export default MyCustomers;

export const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  scrollCont: { flexGrow: 1 },
  DividerCont: {
    backgroundColor: theme.colors.textInBgColor,
    height: 10,
    width: '100%',
  },
  itemCont: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing.m,
    marginVertical: theme.spacing.m - 6,
  },
  divider: {
    height: 1,
  },
  profilePhoto: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.xl,
  },
  nameTimeCont: {
    marginLeft: theme.spacing.m,
  },
  txtName: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m + 3,
  },
  txtTime: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.s,
  },
  noDataIcons: {
    height: 100,
    width: 100,
  },
}));
