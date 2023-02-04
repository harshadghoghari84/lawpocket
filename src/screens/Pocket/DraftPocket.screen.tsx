import React, { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// relative path
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import DraftFileIcon from 'src/components/svg/DraftFileIcon';
import PdfIcon from 'src/components/svg/PdfIcon';
import SearchIcon from 'src/components/svg/SearchIcon';
import { UserType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAllSharedFiles } from 'src/hooks/useAllSharedFiles';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { useMyPocket } from 'src/hooks/useMyPocket';
import {
  selectSharedFiles,
  selectStorage,
} from 'src/redux/settings/settings.selectors';
import {
  setCurrentCaseFileId,
  sharedFiles,
  storage,
} from 'src/redux/settings/settings.slice';
import { ThemeProps } from 'src/types/global.types';
import { MyPocketTopTabNavigationProps } from 'src/types/navigation.types';
import { lstItemsProps, StorageDraftItemProps } from 'src/types/settings.types';
import { getUrlExtension } from 'src/utils/common';
import { NoDataFound } from 'src/components/ui/NoDataFound';

const DraftPocket: React.FC<
  MyPocketTopTabNavigationProps<Route.navDraftPocket>
> = ({ navigation }) => {
  const StorageData = useSelector(selectStorage);
  const StorageSharedFilesData = useSelector(selectSharedFiles);
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });

  const [value, setValue] = React.useState<string>('');
  const [shareDocuments, setSharedDocuments] = React.useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data: currentUser } = useMeQuery();
  const {
    data: SharedFilesData,
    isRefetching,
    refetch: reFetchSharedFilesData,
  } = useAllSharedFiles();
  const { data: myPocketData, refetch: reFetchMyPocket } = useMyPocket();

  // const totalStorage = currentUser?.subscription?.gbStorage
  //   ? currentUser?.subscription?.gbStorage < '0'
  //     ? ''
  //     : currentUser?.subscription?.gbStorage
  //   : '';

  useEffect(() => {
    if (myPocketData) {
      let obj = {
        all: myPocketData.all,
        draft: myPocketData.draft,
        size: myPocketData.size,
      };
      let draftArr: StorageDraftItemProps[] = [];
      myPocketData?.draft?.map((itm, ind) => {
        draftArr.push({ caseId: itm.caseId, fileName: `casefile-${ind + 1}` });
      });
      obj.draft = draftArr;

      dispatch(storage(obj));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPocketData]);

  useEffect(() => {
    if (
      currentUser?.userType === UserType.ATTORNEY ||
      currentUser?.userType === UserType.LAW_FIRM ||
      currentUser?.userType === UserType.LEGAL_SERVICE_PROVIDER
    ) {
      dispatch(sharedFiles(SharedFilesData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SharedFilesData, currentUser]);

  useEffect(() => {
    if (
      StorageSharedFilesData?.pocketData?.lst?.length > 0 ||
      StorageSharedFilesData?.caseData?.lst?.length > 0
    ) {
      setSharedDocuments([
        ...StorageSharedFilesData.pocketData.lst,
        ...StorageSharedFilesData.caseData.lst,
      ]);
    }
  }, [StorageSharedFilesData]);

  useEffect(() => {
    if (!isRefetching && refreshing) {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [refreshing, isRefetching]);

  const pullToRefreshData = () => {
    setRefreshing(true);
    reFetchSharedFilesData().then();
    reFetchMyPocket().then();
  };

  let filtered_Data = StorageData?.draft?.filter(item => {
    return item?.fileName?.toLowerCase().indexOf(value.toLowerCase()) > -1;
  });

  // let filtered_Data = StorageData.draft;
  let filtered_SharedFiles_Data = shareDocuments?.filter(item => {
    return item?.fileName.toLowerCase().indexOf(value.toLowerCase()) > -1;
  });

  return (
    <View style={styles.container}>
      {(currentUser?.userType === UserType.ATTORNEY ||
        currentUser?.userType === UserType.LAW_FIRM ||
        currentUser?.userType === UserType.LEGAL_SERVICE_PROVIDER) && (
        <View style={styles.txtInCont}>
          <CustomTxtInput
            placeholder="Search"
            rightIcon={<SearchIcon color={theme.colors.primary} />}
            value={value}
            onChangeText={val => setValue(val)}
          />
        </View>
      )}
      <View style={styles.docAvailableCont}>
        <Text style={styles.txtAvailableDoc}>
          {currentUser?.userType === UserType.ATTORNEY ||
          currentUser?.userType === UserType.LAW_FIRM ||
          currentUser?.userType === UserType.LEGAL_SERVICE_PROVIDER
            ? shareDocuments.length + ' documents(s) available'
            : StorageData.draft.length + ' draft(s) available'}
        </Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={theme.colors.refreshLoaderColor}
            refreshing={refreshing}
            onRefresh={pullToRefreshData}
          />
        }
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollCont}>
        <View style={styles.itmContainer}>
          {currentUser?.userType === UserType.ATTORNEY ||
          currentUser?.userType === UserType.LAW_FIRM ||
          currentUser?.userType === UserType.LEGAL_SERVICE_PROVIDER ? (
            <View style={styles.draftCont}>
              {filtered_SharedFiles_Data?.length > 0 ? (
                <>
                  {filtered_SharedFiles_Data?.map((item: lstItemsProps) => {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                          navigation.navigate({
                            name: Route.navFileViewer as never,
                            params: { data: item } as never,
                          })
                        }
                        activeOpacity={0.6}
                        style={styles.itmStorage}>
                        {getUrlExtension(item.url) === 'pdf' ? (
                          <View style={styles.innerItmStorage}>
                            <PdfIcon height={50} width={50} />
                          </View>
                        ) : (
                          <Image
                            source={{ uri: item.url }}
                            style={styles.itmImage}
                          />
                        )}
                        <Text numberOfLines={1} style={styles.txtItmName}>
                          {item.fileName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : (
                <NoDataFound
                  loading={refreshing}
                  noDataText={'No shared files!'}
                  noDataIcon={
                    <Image
                      source={require('src/helper/image/noShareFile.png')}
                      style={[
                        styles.noDataIcons,
                        { marginLeft: theme.spacing.m },
                      ]}
                    />
                  }
                />
              )}
            </View>
          ) : (
            <View style={styles.draftCont}>
              {filtered_Data?.length > 0 ? (
                <>
                  {filtered_Data?.map((item: StorageDraftItemProps) => {
                    return (
                      <TouchableOpacity
                        key={item.caseId}
                        onPress={() => {
                          dispatch(setCurrentCaseFileId(`${item.caseId}`));

                          navigation.navigate({
                            name: Route.navInformationAboutIssue as never,
                            params: { activeUpdate: true } as never,
                          });
                        }}
                        activeOpacity={0.6}
                        style={styles.itmStorage}>
                        <View style={styles.innerItmStorage}>
                          <DraftFileIcon color={theme.colors.primary} />
                        </View>

                        <Text numberOfLines={1} style={styles.txtItmName}>
                          {item.fileName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : (
                <NoDataFound
                  loading={refreshing}
                  noDataText={'No draft!'}
                  noDataIcon={
                    <Image
                      source={require('src/helper/image/draft.png')}
                      style={styles.noDataIcons}
                    />
                  }
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
      {/* <Text style={styles.txtTotStorage}>
        {StorageData.size} {totalStorage ? `/ ${niceBytes(totalStorage)}` : ''}
      </Text> */}
    </View>
  );
};

export default DraftPocket;

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingTop: theme.spacing.s,
    paddingBottom: props.insets.bottom,
  },
  txtInCont: {
    marginHorizontal: theme.spacing.m,
    // marginTop: theme.spacing.m - 6,
  },
  txtAvailableDoc: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    // marginLeft: theme.spacing.m,
    // marginVertical: theme.spacing.m - 6,
    fontWeight: '600',
  },
  docAvailableCont: {
    marginHorizontal: theme.spacing.m,
    marginVertical: theme.spacing.m - 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itmStorage: {
    alignItems: 'flex-start',
    margin: theme.spacing.s,
  },
  innerItmStorage: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itmImage: {
    height: 98,
    width: 98,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.m,
  },
  itmContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.m - 6,
    marginBottom: theme.spacing.l * 2,
  },
  scrollCont: {
    flexGrow: 1,
  },
  txtItmName: {
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.s - 3,
    width: 100,
  },
  iconCheckCont: {
    position: 'absolute',
    bottom: 30,
    right: 10,
  },
  checkBoxCont: {
    position: 'absolute',
    right: -15,
    top: -10,
  },
  txtSave: {
    fontWeight: '500',
    color: theme.colors.pinkDark,
  },
  txtTotStorage: {
    color: theme.colors.primary,
    alignSelf: 'center',
    marginBottom: theme.spacing.xxl + 20,
  },
  noDataIcons: {
    height: 70,
    width: 70,
  },
  draftCont: {
    flex: 1,
  },
}));
