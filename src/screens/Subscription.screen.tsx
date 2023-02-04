import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import RNIap, {
  finishTransaction,
  getProducts,
  InAppPurchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  SubscriptionPurchase,
} from 'react-native-iap';
import { useSelector } from 'react-redux';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { Divider } from 'src/components/Divider';
import GoldSubscriptionIcon from 'src/components/svg/GoldSubscriptionIcon';
import PlusIcon from 'src/components/svg/PlusIcon';
import SubscribedIcon from 'src/components/svg/SubscribedIcon';
import UltraSubscriptionIcon from 'src/components/svg/UltraSubscriptionIcon';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { HEIGHT, WIDTH } from 'src/constants';
import { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { useSubscription } from 'src/hooks/useSubscriptionList';
import { setSuccess } from 'src/redux/global/global.slice';
import { selectSubscriptionLoading } from 'src/redux/subscription/subscription.selector';
import { verifySubscriptionReceipt } from 'src/redux/subscription/subscription.thunk';
import { LoadingState } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import { GetSubscriptionProps } from 'src/types/subscription.types';

export type dataItems = {
  index: {};
  item: {
    icon: string;
    title: string;
    txt1: string;
    txt2: string;
    dollar: number;
  };
};

// remove when necessary

let itemSkus: string[] = [];
let purchaseUpdateSubscription: any;
let purchaseErrorSubscription: any;

const Subscription: React.FC<MainNavigationProps<Route.navSubscriptions>> = ({
  route,
  navigation,
}) => {
  const loading = useSelector(selectSubscriptionLoading);

  const styles = useStyles();
  const { theme } = useTheme();
  const {
    data: subscriptionData,
    isLoading,
    isRefetching,
    refetch: reFetchSubscription,
  } = useSubscription();
  const { data: currentUser, refetch } = useMeQuery();

  const dispatch = useAppDispatch();

  console.log('currentUser', currentUser);
  const [activeBackBtn, setActiveBackBtn] = React.useState<boolean>(false);
  const [availablePlans, setAvailablePlans] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [purchaseLoader, setPurchaseLoader] = React.useState(false);
  const [refreshing, setRefreshing] = useState(false);

  React.useEffect(() => {
    if (subscriptionData?.length > 0) {
      const filterId = subscriptionData.map(ele =>
        ele.product !== null ? ele.product : '',
      );
      itemSkus = Platform.select({
        ios: filterId,
        android: filterId,
      });
      getProduct();
    }
  }, [subscriptionData]);

  const getProduct = () => {
    try {
      setLoader(true);
      RNIap.initConnection().then(connection => {
        if (connection) {
          getProducts(itemSkus)
            .then(res => {
              setAvailablePlans(res);
              setLoader(false);
            })
            .catch(() => {
              setLoader(false);
            });
        }
      });
    } catch (error) {
      setLoader(false);
    }
  };

  React.useEffect(() => {
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        // console.info('purchase', purchase);

        const receipt =
          purchase.transactionReceipt && purchase.transactionReceipt;
        // console.info(receipt);
        if (receipt) {
          try {
            const ackResult = await finishTransaction(purchase);
            console.info('ackResult', ackResult);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }

          // this.setState({receipt}, () => this.goNext());
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log('purchaseErrorListener', error);
      },
    );

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      RNIap.endConnection();
    };
  }, []);

  const onPurchase = async (item: GetSubscriptionProps) => {
    try {
      setPurchaseLoader(true);
      const products = await RNIap.requestSubscription(item?.product);
      if (products && products !== null) {
        console.log('products', products);
        setPurchaseLoader(false);
        try {
          const result = await dispatch(
            verifySubscriptionReceipt({
              subscriptionId: item.id,
              verifyReceipt: products.transactionReceipt,
            }),
          );
          console.log('result', result);
          if (verifySubscriptionReceipt.fulfilled.match(result)) {
            dispatch(setSuccess(result.payload));
            refetch().then();
            if (activeBackBtn) {
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: Route.navDashboard }],
                }),
              );
            }
          } else {
          }
        } catch (error) {
          console.log('subscription ERROR', error);
        }
      }
    } catch (err) {
      setPurchaseLoader(false);
      console.warn(err.code, err.message);
    }
  };

  const pullToRefreshData = () => {
    setRefreshing(true);
    reFetchSubscription().then();
  };

  useEffect(() => {
    if (!isRefetching && refreshing) {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [refreshing, isRefetching]);

  // const getAvailablePurchases = async () => {
  //   try {
  //     console.log(
  //       'Get available purchases (non-consumable or unconsumed consumable)',
  //     );

  //     const purchases = await RNIap.getAvailablePurchases();
  //     console.log('Available purchases :: ', purchases);
  //     if (purchases && purchases.length > 0) {
  //       // this.setState({
  //       //   availableItemsMessage: `Got ${purchases.length} items.`,
  //       //   receipt: purchases[0].transactionReceipt,
  //       // });
  //     }
  //   } catch (err) {
  //     console.log(err.code, err.message);
  //   }
  // };

  console.log('availablePlans', availablePlans);

  React.useEffect(() => {
    if (route?.params?.activeBack) {
      setActiveBackBtn(route?.params?.activeBack);
    }
  }, [route]);

  const SubscribedComp = () => {
    return (
      <View style={styles.subscribedCont}>
        <SubscribedIcon color={theme.colors.subscribedColor} />
        <Text style={styles.txtSubscribed}>Subscribed</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        onlyHeaderTitle={activeBackBtn === false ? true : false}
        title={'Subscriptions'}
        backBtn={activeBackBtn}
        dummy={activeBackBtn}
      />

      {subscriptionData?.length > 0 && availablePlans.length > 0 ? (
        <FlatList
          data={subscriptionData}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.refreshLoaderColor}
              refreshing={refreshing}
              onRefresh={pullToRefreshData}
            />
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(_item, index) => index.toString()}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.flatLstContStyle}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.itemCont}>
                <View style={styles.itemIconTxtCont}>
                  {index === 0 ? (
                    <PlusIcon />
                  ) : index === 1 ? (
                    <GoldSubscriptionIcon />
                  ) : (
                    <UltraSubscriptionIcon />
                  )}

                  <Text style={styles.txtTitle}>{item.title}</Text>
                </View>
                <Text style={styles.txt12}>- {item.description}</Text>

                {currentUser?.subscription?.product === item?.product &&
                currentUser?.expiryDate ? (
                  moment(currentUser?.expiryDate).format('DD/MM/YYYY') <
                  moment(new Date()).format('DD/MM/YYYY') ? null : (
                    <Text style={styles.txt12}>
                      Valid till{' '}
                      {moment(currentUser?.expiryDate).format('DD/MM/YYYY')}
                    </Text>
                  )
                ) : null}

                <View style={styles.itemBottomButtonCont}>
                  {availablePlans &&
                    availablePlans?.map(itm => {
                      if (itm.productId === item?.product) {
                        return (
                          <Text style={styles.txtDollar}>{`${
                            itm.localizedPrice
                          }/${itm.subscriptionPeriodUnitIOS.toLowerCase()}`}</Text>
                        );
                      } else {
                        if (
                          currentUser?.userType === UserType.LAW_STUDENT ||
                          currentUser?.userType === UserType.CLIENT
                        ) {
                          return <Text style={styles.txtDollar}>FREE</Text>;
                        }
                      }
                    })}

                  {availablePlans &&
                    availablePlans?.map(itm => {
                      if (
                        itm?.productId === currentUser?.subscription?.product &&
                        itm.productId === item?.product
                      ) {
                        if (
                          moment(currentUser?.expiryDate).format('DD/MM/YYYY') <
                          moment(new Date()).format('DD/MM/YYYY')
                        ) {
                          return (
                            <CustomButton
                              name={'Subscribe'}
                              smallBtn={WIDTH / 2 - 60}
                              height={35}
                              borderRadius={6}
                              disabled={loading === LoadingState.CREATE}
                              onPress={() => {
                                onPurchase(item);
                                // getAvailablePurchases();
                              }}
                            />
                          );
                        } else {
                          return <SubscribedComp />;
                        }
                      } else {
                        if (itm?.productId === item?.product) {
                          return (
                            <CustomButton
                              name={'Subscribe'}
                              smallBtn={WIDTH / 2 - 60}
                              height={35}
                              borderRadius={6}
                              disabled={loading === LoadingState.CREATE}
                              onPress={() => {
                                onPurchase(item);
                                // getAvailablePurchases();
                              }}
                            />
                          );
                        } else {
                          if (
                            (currentUser?.userType === UserType.LAW_STUDENT ||
                              currentUser?.userType === UserType.CLIENT) &&
                            (currentUser?.subscription === null ||
                              currentUser?.subscription?.product === null)
                          ) {
                            return <SubscribedComp />;
                          }
                        }
                      }
                    })}
                </View>
              </View>
            );
          }}
        />
      ) : (
        <NoDataFound
          loading={isLoading || loader}
          noDataText={'No data found!'}
        />
      )}
      {activeBackBtn === false &&
      (currentUser?.userType === UserType.CLIENT ||
        currentUser?.userType === UserType.LAW_STUDENT) &&
      (!isLoading || !loader) ? (
        <View style={styles.btnContinue}>
          <CustomButton
            name={'Continue'}
            borderRadius={6}
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: Route.navDashboard }],
                }),
              );
            }}
          />
        </View>
      ) : null}
      {purchaseLoader || loading === LoadingState.CREATE ? (
        <View style={styles.loadingView}>
          <ActivityIndicator color={theme.colors.white} />
        </View>
      ) : null}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  text: {
    color: theme.colors?.primary,
  },
  flatLstContStyle: {
    backgroundColor: theme.colors.textInBgColor,
  },
  itemCont: {
    paddingHorizontal: theme.spacing.l - 4,
    backgroundColor: theme.colors.background,
  },
  itemIconTxtCont: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: theme.spacing.m - 6,
  },
  iconCont: {
    height: 30,
    width: 30,
    backgroundColor: theme.colors.grey,
    borderRadius: theme.borderRadii.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBottomButtonCont: {
    marginTop: theme.spacing.m - 11,
    marginBottom: theme.spacing.l - 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  txtDollar: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  txt12: {
    fontSize: theme.fontSize.m - 2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.s,
  },
  separatorCont: {
    height: 10,
    backgroundColor: theme.colors.textInBgColor,
    width: '100%',
  },
  txtTitle: {
    marginLeft: theme.spacing.m - 6,
    fontSize: theme.fontSize.l - 8,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: theme.colors.blackTrans,
    alignSelf: 'center',
    height: HEIGHT,
    width: WIDTH,
  },
  txtSubscribed: {
    color: theme.colors.subscribedColor,
    marginLeft: theme.spacing.s,
    fontSize: theme.fontSize.m,
  },
  subscribedCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnContinue: {
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m - 6,
  },
}));

export default Subscription;
