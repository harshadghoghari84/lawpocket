import * as React from 'react';
import { FlatList, Image, RefreshControl, Text, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import CustomHeader from 'src/components/CustomHeader';
import { Divider } from 'src/components/Divider';
// relative path
import ReviewItem from 'src/components/ReviewItem';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { Route } from 'src/constants/navigationConstants';
import { useRateReviewById } from 'src/hooks/useRateReviewList';
import { MainNavigationProps } from 'src/types/navigation.types';

const Reviews: React.FC<MainNavigationProps<Route.navReviewsScreen>> = ({
  route,
}) => {
  const { userId } = route?.params;
  const styles = useStyles();
  const { theme } = useTheme();

  const [fetchMore, setFetchMore] = React.useState(0);

  const { data, isLoading, isPreviousData, refetch } = useRateReviewById(
    `${userId}`,
    '10',
    `${fetchMore}`,
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        backBtn={true}
        title={Route.navReviewsScreen}
        dummy={true}
      />
      <View style={styles.reviewCont}>
        <Text style={styles.txtReviews}>
          Reviews{' '}
          <Text style={styles.txtInnerReviews}>
            {data?.data ? `(${data?.data?.length})` : 0}
          </Text>
        </Text>
      </View>
      {data?.data?.length > 0 ? (
        <FlatList
          data={data.data}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.refreshLoaderColor}
              refreshing={isLoading}
              onRefresh={() => refetch().then()}
            />
          }
          onEndReached={() => {
            if (!isPreviousData && data?.count > data?.data?.length) {
              setFetchMore(old => old + 1);
            }
          }}
          keyExtractor={(_item, index) => index.toString()}
          contentContainerStyle={styles.scrollCont}
          renderItem={({ item }) => {
            return (
              <ReviewItem
                byUser={item.byUser}
                date={item.date}
                id={item.id}
                rate={item.rate}
                review={item.review}
              />
            );
          }}
        />
      ) : (
        <NoDataFound
          loading={isLoading}
          noDataText={'No review!'}
          noDataIcon={
            <Image
              source={require('src/helper/image/noReview.png')}
              style={styles.noDataIcons}
            />
          }
        />
      )}
    </View>
  );
};

export default Reviews;

export const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  scrollCont: { flexGrow: 1 },
  DividerCont: {
    backgroundColor: theme.colors.textInBgColor,
    height: 10,
    width: '100%',
  },
  reviewItmCont: {
    paddingHorizontal: theme.spacing.l - 4,
    paddingVertical: theme.spacing.m - 6,
  },
  reviewCont: {
    marginLeft: theme.spacing.l - 4,
    marginTop: theme.spacing.l - 4,
  },
  txtReviews: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    marginVertical: theme.spacing.s - 5,
    color: theme.colors.textPrimary,
  },
  txtInnerReviews: {
    color: theme.colors.grey,
  },
  divider: {
    height: 1,
  },
  noDataIcons: {
    height: 100,
    width: 100,
  },
}));
