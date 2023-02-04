import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
// relative path
import { CheckBox, makeStyles, useTheme } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import ModalFooter from 'src/components/BottomSheetFooter';
import { CustomTxtInput } from 'src/components/CustomTextInput';
import CheckIcon from 'src/components/svg/CheckIcon';
import PdfIcon from 'src/components/svg/PdfIcon';
import SearchIcon from 'src/components/svg/SearchIcon';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { API } from 'src/constants/apiEndpoints';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { useMyPocket } from 'src/hooks/useMyPocket';
import { fetch } from 'src/redux/fetch';
import { myPocket, removeFile } from 'src/redux/myPocket/myPocket.thunk';
import { selectStorage } from 'src/redux/settings/settings.selectors';
import { selectedFiles, storage } from 'src/redux/settings/settings.slice';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { ThemeProps } from 'src/types/global.types';
import { MyPocketTopTabNavigationProps } from 'src/types/navigation.types';
import { StorageItemProps, StorageProps } from 'src/types/settings.types';
import { getUrlExtension, niceBytes } from 'src/utils/common';

interface FormDataProps {
  name: string;
  type: string;
  uri: string;
}

const AllPocket: React.FC<
  MyPocketTopTabNavigationProps<Route.navAllPocket>
> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const StorageData = useSelector(selectStorage);
  const { theme } = useTheme();
  const modalizeRef = React.useRef<Modalize>(null);
  const [image, setImage] = React.useState([]);

  const { data: myPocketData, isRefetching, refetch } = useMyPocket();
  const { data: currentUser } = useMeQuery();

  const totalStorage = currentUser?.subscription?.gbStorage
    ? currentUser?.subscription?.gbStorage < '0'
      ? ''
      : currentUser?.subscription?.gbStorage
    : '';

  useEffect(() => {
    if (myPocketData) {
      dispatch(storage(myPocketData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPocketData]);

  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const [value, setValue] = React.useState<string>('');
  const [activeVideo] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [activeCheckBox, setActiveCheckBox] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState([]);
  const [myPocketArr, setMyPocketArr] = useState([]);
  const [caseFileArr, setCaseFileArr] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {
    modalizeCont,
    openPickerCont,
    txtModalText,
    modalDividerCont,
    modalizeCancelBtn,
    fontBold,
  } = commonStyles();

  useEffect(() => {
    dispatch(
      selectedFiles({ myPocketId: '', caseId: '', fileName: '', fileType: '' }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pullToRefreshData = () => {
    setRefreshing(true);
    refetch().then();
  };

  useEffect(() => {
    if (!isRefetching && refreshing) {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [refreshing, isRefetching]);

  const uploadFiles = async (res: FormDataProps[]) => {
    const formData = new FormData();
    Object.entries(res).forEach(([_key, val]) => {
      formData.append('documents', {
        name: val.name || `IMG-${new Date()}.${getUrlExtension(val.uri)}`,
        type: val.type,
        uri: Platform.OS === 'ios' ? val.uri.replace('file://', '') : val.uri,
        fileName: val.name,
        docType: val.type,
      });
    });
    const result = await dispatch(myPocket(formData));
    if (myPocket.fulfilled.match(result)) {
      setImage([]);
      const { data } = await fetch<StorageProps>({
        url: API.MY_POCKET,
        method: 'GET',
      });
      if (data) {
        dispatch(storage(data));
      }
    } else {
    }
  };

  const openPickerCamera = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Law-Pocket Photo App Camera Permission',
            message: 'Law-Pocket Photo App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (activeVideo) {
            ImagePicker.openCamera({ mediaType: 'video' }).then(images => {
              // setImage([...image, { img: images.path }]);
              let obj = {
                name: images.filename ? images.filename : '',
                type: images.mime,
                uri: images.path,
              };
              uploadFiles([obj]);
            });
          } else {
            ImagePicker.openCamera({}).then(images => {
              // setImage([...image, { img: images.path }]);
              let obj = {
                name: images.filename ? images.filename : '',
                type: images.mime,
                uri: images.path,
              };
              uploadFiles([obj]);
            });
          }
        } else {
          Snackbar.show({
            text: 'Camera permission denied',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: theme.colors.grey5,
            textColor: theme.colors.black,
          });
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      if (activeVideo) {
        ImagePicker.openCamera({ mediaType: 'video' }).then(images => {
          // setImage([...image, { img: images.path }]);
          let obj = {
            name: images.filename ? images.filename : '',
            type: images.mime,
            uri: images.path,
          };
          uploadFiles([obj]);
        });
      } else {
        ImagePicker.openCamera({}).then(images => {
          console.log('images', images);
          let obj = {
            name: images.filename ? images.filename : '',
            type: images.mime,
            uri: images.path,
          };
          uploadFiles([obj]);

          // setImage([obj]);
        });
      }
    }
  };

  const openPicker = () => {
    if (activeVideo) {
      ImagePicker.openPicker({ mediaType: 'video', multiple: true }).then(
        images => {
          let arr = [];

          for (let i = 0; i < images.length; i++) {
            arr.push({ img: images[i].path });
          }

          setImage([...image, ...arr]);
        },
      );
    } else {
      pickImage();
    }
  };
  const openPickerPhotos = () => {
    ImagePicker.openPicker({}).then(images => {
      console.log('images', images);
      let obj = {
        name: images.filename ? images.filename : '',
        type: images.mime,
        uri: images.path,
      };
      uploadFiles([obj]);

      // setImage([obj]);
    });
  };

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      if (res.length) {
        // setImage(res);
        if (
          res[0].type === 'application/pdf' ||
          res[0].type === 'image/jpg' ||
          res[0].type === 'image/jpeg' ||
          res[0].type === 'image/png'
        ) {
          uploadFiles(res);
        } else {
          Snackbar.show({
            text: 'Invalid file format',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: theme.colors.error,
            textColor: theme.colors.white,
          });
        }
      }
    } catch (e) {
      if (DocumentPicker.isCancel(e)) {
      } else {
        console.log('catch err', e);
      }
    }
  };

  const onPressCheckBox = (myPocketId: string) => {
    // setActiveItem({ id: item.myPocketId, fileType: item.fileType });
    if (activeItem.includes(myPocketId)) {
      let filterArr = activeItem.filter((itm: string) => itm !== myPocketId);
      setActiveItem(filterArr);
    } else {
      setActiveItem([...activeItem, myPocketId]);
    }
  };

  const selectMyPocketId = (myPocketId: string) => {
    // setActiveItem({ id: item.myPocketId, fileType: item.fileType });
    if (myPocketId) {
      if (myPocketArr.includes(myPocketId)) {
        let filterArr = myPocketArr.filter((itm: string) => itm !== myPocketId);
        setMyPocketArr(filterArr);
      } else {
        setMyPocketArr([...myPocketArr, myPocketId]);
      }
    }
  };
  const selectMyCaseFile = (caseId: string) => {
    // setActiveItem({ id: item.caseId, fileType: item.fileType });
    if (caseId) {
      if (caseFileArr.includes(caseId)) {
        let filterArr = caseFileArr.filter((itm: string) => itm !== caseId);
        setCaseFileArr(filterArr);
      } else {
        setCaseFileArr([...caseFileArr, caseId]);
      }
    }
  };

  const onPressDelete = async () => {
    setLoader(true);
    const result = await dispatch(
      removeFile({ myPocketArr: myPocketArr, caseFileArr: caseFileArr }),
    );
    if (removeFile.fulfilled.match(result)) {
      setLoader(false);

      setActiveItem([]);
      const { data } = await fetch<StorageProps>({
        url: API.MY_POCKET,
        method: 'GET',
      });
      if (data) {
        dispatch(storage(data));
      }
    } else {
      setLoader(false);
    }
  };

  let filtered_Data = StorageData?.all?.filter(item => {
    return item?.fileName.toLowerCase().indexOf(value.toLowerCase()) > -1;
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.txtInCont}>
          <CustomTxtInput
            placeholder="Search"
            rightIcon={<SearchIcon color={theme.colors.primary} />}
            value={value}
            onChangeText={val => setValue(val)}
          />
        </View>
        <View style={styles.docAvailableCont}>
          <Text style={styles.txtAvailableDoc}>
            {StorageData.all.length} document(s) available
          </Text>
          {activeItem.length > 0 ? (
            <TouchableOpacity onPress={() => onPressDelete()}>
              {loader ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <Text style={styles.txtSave}>Delete</Text>
              )}
            </TouchableOpacity>
          ) : (
            <>
              {activeCheckBox ? (
                <TouchableOpacity
                  onPress={() => setActiveCheckBox(!activeCheckBox)}>
                  <Text style={styles.txtSave}>Cancel</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.removeUploadCont}>
                  {filtered_Data.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => setActiveCheckBox(!activeCheckBox)}>
                      <Text style={styles.txtSave}>Remove</Text>
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity onPress={() => modalizeRef.current.open()}>
                    <Text style={styles.txtSave}>Upload</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
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
            {filtered_Data?.length > 0 ? (
              <>
                {filtered_Data?.map((item: StorageItemProps) => {
                  return (
                    <TouchableOpacity
                      key={item.myPocketId}
                      onPress={() =>
                        navigation.navigate({
                          name: Route.navFileViewer as never,
                          params: { data: item } as never,
                        })
                      }
                      activeOpacity={0.6}
                      style={styles.itmStorage}>
                      {item.fileType === 'application/pdf' ? (
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
                      {activeCheckBox && (
                        // <View style={styles.checkBoxContainer}>
                        <CheckBox
                          checked={activeItem.includes(
                            item.myPocketId || item.caseId,
                          )}
                          containerStyle={styles.checkBoxCont}
                          checkedIcon={
                            <CheckIcon color={theme.colors.primary} />
                          }
                          uncheckedIcon={
                            <MaterialCommunityIcons
                              name="checkbox-blank-outline"
                              size={20}
                              color={theme.colors.black}
                            />
                          }
                          onPress={() => {
                            onPressCheckBox(item.myPocketId || item.caseId);
                            selectMyPocketId(item.myPocketId);
                            selectMyCaseFile(item.caseId);
                          }}
                        />
                        // </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </>
            ) : (
              <NoDataFound
                noDataText={'No documents!'}
                noDataIcon={
                  <Image
                    source={require('src/helper/image/noStorage.png')}
                    style={styles.noDataIcons}
                  />
                }
              />
            )}
          </View>
        </ScrollView>
        <Text style={styles.txtTotStorage}>
          {StorageData.size}{' '}
          {totalStorage ? `/ ${niceBytes(totalStorage)}` : ''}
        </Text>
      </View>
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          disableScrollIfPossible
          handleStyle={styles.modalHandleStyle}
          FooterComponent={() => <ModalFooter />}
          modalStyle={styles.modalStyle}>
          <>
            <View style={modalizeCont}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  openPickerCamera();
                  modalizeRef.current?.close();
                }}
                style={openPickerCont}>
                <Text style={txtModalText}>Camera</Text>
              </TouchableOpacity>
              <View style={modalDividerCont} />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  openPickerPhotos();
                  modalizeRef.current?.close();
                }}
                style={openPickerCont}>
                <Text style={txtModalText}>Photos</Text>
              </TouchableOpacity>
              <View style={modalDividerCont} />
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  openPicker();
                  modalizeRef.current?.close();
                }}
                style={openPickerCont}>
                <Text style={txtModalText}>Files</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                modalizeRef.current?.close();
              }}
              style={modalizeCancelBtn}>
              <Text style={[txtModalText, fontBold]}>Cancel</Text>
            </TouchableOpacity>
          </>
        </Modalize>
      </Portal>
    </>
  );
};

export default AllPocket;

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
    marginHorizontal: theme.spacing.m - 6,
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
    right: -5,
    top: -2,
    backgroundColor: theme.colors.white,
    padding: 3,
    borderRadius: theme.borderRadii.s,
  },
  txtSave: {
    fontWeight: '500',
    color: theme.colors.pinkDark,
    marginLeft: theme.spacing.s,
  },
  txtTotStorage: {
    color: theme.colors.primary,
    alignSelf: 'center',
    marginBottom: theme.spacing.xxl + 20,
  },
  modalHandleStyle: { backgroundColor: theme.colors.transparent },
  modalStyle: {
    backgroundColor: theme.colors.transparent,
    elevation: 0,
    // flex: 1,
  },
  removeUploadCont: { flexDirection: 'row' },
  checkBoxContainer: {
    backgroundColor: theme.colors.white,
    position: 'absolute',
    // right: -15,
    // top: -10,
  },
  noDataIcons: {
    height: 70,
    width: 70,
  },
}));
