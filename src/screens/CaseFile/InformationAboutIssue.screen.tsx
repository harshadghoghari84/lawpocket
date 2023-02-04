import { CommonActions } from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import BottomSheetChooseCity from 'src/components/BottomSheetChooseCity';
import BottomSheetChooseImage from 'src/components/BottomSheetChooseImage';
import BottomSheetChooseLocation from 'src/components/BottomSheetChooseLocation';
import ModalFooter from 'src/components/BottomSheetFooter';
import ChooseItems from 'src/components/ChooseItems';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { Divider } from 'src/components/Divider';
import { NameFirstChar } from 'src/components/NameFirstChar';
import AttachmentIcon from 'src/components/svg/AttachmentIcon';
import CloseIcon from 'src/components/svg/CloseIcon';
import PdfIcon from 'src/components/svg/PdfIcon';
import constants, { CaseFileIssueType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useCaseFile } from 'src/hooks/useCaseFile';
import { useCityOfState, useStateOfCountry } from 'src/hooks/useLocation';
import { useMeQuery } from 'src/hooks/useMeQuery';
import { selectCaseFileLoading } from 'src/redux/caseFile/caseFile.selector';
import { updateCaseFile } from 'src/redux/caseFile/caseFile.thunk';
import { setSuccess } from 'src/redux/global/global.slice';
import { caseFileSelector } from 'src/redux/settings/settings.selectors';
import {
  selectedFilterLawyer,
  setCurrentCaseFileId,
} from 'src/redux/settings/settings.slice';
import { ImageProps } from 'src/screens/EditPost.screen';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import { getFilename, getUrlExtension } from 'src/utils/common';

const InformationAboutIssue: React.FC<
  MainNavigationProps<Route.navInformationAboutIssue>
> = ({ navigation, route: { params } }) => {
  const loading = useSelector(selectCaseFileLoading);
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const modalizeRef = React.useRef<Modalize>(null);
  const modalChooseImageRef = React.useRef<Modalize>(null);
  const modalizeRefState = React.useRef<Modalize>(null);
  const modalizeRefCity = React.useRef<Modalize>(null);

  const dispatch = useAppDispatch();

  const issueType: { tit: string; type: number }[] = [
    { tit: 'Criminal', type: CaseFileIssueType.CRIMINAL },
    { tit: 'Civil', type: CaseFileIssueType.CIVIL },
    { tit: "I don't know", type: CaseFileIssueType.I_DONT_KNOW },
  ];

  const [image, setImage] = React.useState<ImageProps[]>([]);
  const [value, setValue] = React.useState<string>('');
  const [customName, setCustomName] = React.useState<string>('');
  const [caseFileType, setCaseFileType] = React.useState<number>(null);

  const [enableEdit, setEnableEdit] = React.useState<boolean>(false);
  // const [user, setUser] = React.useState<CurrentUser>();
  const [state, setState] = React.useState<string[]>([]);
  const [selectedStateIso, setSelectedStateIso] = React.useState<string[]>([]);
  const [city, setCity] = React.useState<string[]>([]);

  const myCaseFileID = useSelector(caseFileSelector);

  const { data: currentUser } = useMeQuery();

  const { data: currentCaseFile, refetch } = useCaseFile(myCaseFileID);
  const { data: stateData } = useStateOfCountry();
  const { data: cityData } = useCityOfState(selectedStateIso.join());

  const userName =
    currentUser?.firstName && currentUser?.lastName
      ? `${currentUser?.firstName} ${currentUser?.lastName}`
      : currentUser?.firstName
      ? `${currentUser?.firstName}`
      : currentUser?.lastName
      ? `${currentUser?.lastName}`
      : '';

  React.useEffect(() => {
    if (params?.activeUpdate) {
      setEnableEdit(true);
    }
  }, [params]);

  React.useEffect(() => {
    if (myCaseFileID) {
      refetch().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCaseFileID]);

  console.log('currentCaseFile', currentCaseFile);

  React.useEffect(() => {
    if (currentCaseFile) {
      setImage(currentCaseFile?.documents);
      setValue(currentCaseFile?.caseTitle ? currentCaseFile?.caseTitle : '');
      setCaseFileType(currentCaseFile?.caseFileType);
      if (currentCaseFile?.state) {
        let stateArr = currentCaseFile?.state.split(',');
        setState(stateArr);
        let ISO: string[] = [];
        stateData?.map(ele => {
          stateArr?.map(itm => {
            if (ele.name === itm) {
              ISO.push(ele.iso);
            }
          });
        });
        setSelectedStateIso(ISO);
      }
      if (currentCaseFile?.city) {
        let cityArr = currentCaseFile?.city.split(',');
        setCity(cityArr);
      }
      // setUser(currentCaseFile?.user);
      setCustomName(
        currentCaseFile?.customName ? currentCaseFile?.customName : '',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCaseFile]);

  // React.useEffect(() => {
  //   if (selectedStateIso) {

  //     refetchCity().then();
  //   }
  // }, [selectedStateIso]);

  const onFindLawyerPress = async () => {
    dispatch(
      selectedFilterLawyer({
        state: state.join(),
        city: city.join(),
        practiceArea: null,
        caseFile: true,
      }),
    );
    dispatch(setCurrentCaseFileId(''));
    // navigation.navigate(Route.navLawyers);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: Route.navDashboard,
          },
          {
            name: Route.navLawyers,
            params: {
              isFilter: true,
            },
          },
        ],
      }),
    );
  };
  const onPressUpdateCaseFile = async () => {
    try {
      const formData = new FormData();

      formData.append('caseTitle', value);
      formData.append('caseFileType', `${caseFileType}`);
      formData.append('state', state.join());
      formData.append('city', city.join());
      customName && formData.append('customName', customName);

      Object.entries(image).forEach(([_key, val]) => {
        console.log('val', val);
        formData.append('documents', {
          name:
            getFilename(val.name) === 'MOV'
              ? val.name.replace('MOV', 'mp4')
              : val.name || `IMG-${new Date()}.${getUrlExtension(val.uri)}`,
          type: val.mimetype,
          uri:
            Platform.OS === 'ios' ? val?.uri?.replace('file://', '') : val.uri,
        });
      });

      const result = await dispatch(
        updateCaseFile({ formData: formData, caseFileID: myCaseFileID }),
      );

      console.log('result', result);
      if (updateCaseFile.fulfilled.match(result)) {
        refetch().then();
        setEnableEdit(false);
        dispatch(setSuccess(result.payload));
      } else {
      }
    } catch (error) {
      console.log('error==', error);
    }
  };

  const onPressSelectIssueType = () => {
    modalizeRef.current?.open();
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        leftSpace={true}
        // backBtn={true}
        title={constants.caseFile}
        right={
          <TouchableOpacity
            style={styles.editCancelBtn}
            onPress={() => setEnableEdit(!enableEdit)}
          >
            <Text style={styles.txtEdit}>
              {!enableEdit ? 'Edit' : 'Cancel'}
            </Text>
          </TouchableOpacity>
        }
        // onlyHeaderTitle={enableEdit}
      />
      <View style={styles.innerContainer}>
        <View style={styles.topViewCont}>
          <View style={styles.nameProfileCont}>
            {currentUser?.profilePhoto ? (
              <Image
                source={{
                  uri: currentUser?.profilePhoto,
                }}
                style={styles.profileCont}
              />
            ) : (
              <NameFirstChar name={userName} size={40} />
            )}
            <Text style={styles.txtUserName}>{userName}</Text>
          </View>
        </View>
        <Divider />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          style={styles.descriptionCont}
        >
          <Text style={styles.txtItmText}>Types of issue</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              if (enableEdit) {
                onPressSelectIssueType();
              }
            }}
            style={styles.txtInCont}
          >
            <Text style={styles.txtCaseFileType}>
              {caseFileType && caseFileType === CaseFileIssueType.CRIMINAL
                ? 'Criminal'
                : caseFileType === CaseFileIssueType.CIVIL
                ? 'Civil'
                : "I don't know"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.txtItmText}>Case title</Text>
          <TextInput
            editable={enableEdit}
            placeholder="write case title here"
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.txtInCont}
            value={value}
            returnKeyType="done"
            onChangeText={val => setValue(val)}
          />
          {caseFileType && caseFileType === CaseFileIssueType.I_DONT_KNOW && (
            <>
              <Text style={styles.txtItmText}>Issue defined by you</Text>
              <TextInput
                editable={enableEdit}
                placeholder="write custom issue name here"
                placeholderTextColor={theme.colors.textSecondary}
                style={styles.txtInCont}
                value={customName}
                returnKeyType="done"
                returnKeyLabel="done"
                onChangeText={val => setCustomName(val)}
              />
            </>
          )}
          {/* <Text style={styles.txtItmText}>State city</Text> */}

          <View style={styles.topViewSecondCont}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                if (enableEdit) {
                  modalizeRefState.current?.open();
                  setCity([]);
                }
              }}
              style={styles.topSecondItemCont}
            >
              <Ionicons
                name="location-sharp"
                size={20}
                color={theme.colors.primary}
              />
              <Text numberOfLines={1} style={styles.txtTopSecondItemCont}>
                {state && state.length > 0 ? state.join() : 'Select State'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                if (enableEdit) {
                  modalizeRefCity.current?.open();
                }
              }}
              style={styles.topSecondItemCont}
            >
              <Ionicons
                name="location-sharp"
                size={20}
                color={theme.colors.primary}
              />
              <Text numberOfLines={1} style={styles.txtTopSecondItemCont}>
                {city && city.length > 0 ? city.join() : 'Select City'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.txtItmText}>Documents</Text>
          {enableEdit ? (
            <View style={styles.chooseMediaView}>
              <ChooseItems
                title={'Choose media'}
                secondIcon={
                  <AttachmentIcon
                    color={theme.colors.grey}
                    height={20}
                    width={20}
                  />
                }
                onPress={() => {
                  modalChooseImageRef.current?.open();
                }}
              />
            </View>
          ) : null}
          <View style={styles.imageCont}>
            {image?.map(item => {
              return (
                <View style={styles.image}>
                  {getUrlExtension(item.uri) === 'mp4' ? (
                    <TouchableOpacity
                      activeOpacity={1}
                      // onPress={() => {
                      //   setPauseVideo(!pauseVideo);
                      // }}
                    >
                      <Video
                        source={{ uri: item.uri }}
                        style={styles.postImage}
                        resizeMode="stretch"
                        // paused={pauseVideo}
                        repeat={true}
                        volume={0}
                      />
                      {/* <View style={styles.pausePlayCont}>
                        {pauseVideo ? (
                          <Icon
                            name={'play'}
                            size={50}
                            color={theme.colors.white}
                          />
                        ) : null}
                      </View> */}
                    </TouchableOpacity>
                  ) : getUrlExtension(item.uri) === 'pdf' ? (
                    <View style={styles.innerItmStorage}>
                      <PdfIcon height={70} width={70} />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.postImage}
                    />
                  )}
                  {/* <Video
                    source={{
                      uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
                    }}
                    style={styles.postImage}
                    resizeMode="contain"
                    paused={false}
                    repeat={true}
                    volume={0}
                  /> */}
                  {enableEdit && (
                    <TouchableOpacity
                      onPress={() => {
                        var array = [...image];
                        var index = array.indexOf(item);
                        if (index !== -1) {
                          array.splice(index, 1);
                          setImage(array);
                        }
                      }}
                      style={styles.btnClose}
                    >
                      <CloseIcon
                        color={theme.colors.black}
                        height={12}
                        width={12}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View style={styles.btnCont}>
        <CustomButton
          name={!enableEdit ? 'Find attorneys' : 'Update'}
          disabled={loading === LoadingState.CREATE}
          loading={loading === LoadingState.CREATE}
          onPress={() => {
            if (!enableEdit) {
              onFindLawyerPress();
            } else {
              onPressUpdateCaseFile();
            }
          }}
        />
      </View>
      <Portal>
        <Modalize
          handleStyle={styles.modalHandle}
          adjustToContentHeight
          closeOnOverlayTap
          handlePosition="inside"
          FooterComponent={() => <ModalFooter />}
          ref={modalizeRef}
        >
          <View style={styles.modalItmCont}>
            <View style={styles.modalTextInCont}>
              {issueType.map(item => {
                return (
                  <TouchableOpacity
                    onPress={() => setCaseFileType(item.type)}
                    style={styles.selectIssueTypeCont}
                  >
                    <Text
                      style={[
                        styles.txtSelectIssueType,
                        {
                          color:
                            caseFileType === item.type
                              ? theme.colors.textPrimary
                              : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {item.tit}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.modalButtons}>
              <CustomButton
                height={40}
                // smallBtn={WIDTH / 2 - 50}
                borderBtn={true}
                name={'Close'}
                onPress={() => {
                  modalizeRef.current?.close();
                }}
              />
              {/* <CustomButton
                  height={40}
                  smallBtn={WIDTH / 2 - 50}
                  borderBtn={false}
                  name={'submit'}
                  onPress={() => {}}
                /> */}
            </View>
          </View>
        </Modalize>
      </Portal>
      <BottomSheetChooseImage
        modalizeRef={modalChooseImageRef}
        setImage={setImage}
        image={image}
      />
      <BottomSheetChooseLocation
        modalizeRef={modalizeRefState}
        locationData={stateData}
        title={'State'}
        selectedStateItem={state}
        selectedStateIso={selectedStateIso}
        setSelectedStateItem={setState}
        setSelectedStateIso={setSelectedStateIso}
      />
      <BottomSheetChooseCity
        modalizeRef={modalizeRefCity}
        title={'City'}
        locationData={cityData}
        selectedCityItem={city}
        setSelectedCityItem={setCity}
      />
    </View>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom + theme.spacing.s,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  img: { alignSelf: 'center' },
  txtIntro: {
    fontSize: theme.fontSize.l,
    marginVertical: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  btnCont: {
    marginTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.m + 4,
  },
  loaderCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderStyle: {
    height: 50,
    width: 50,
  },
  txtPleaseWait: {
    fontWeight: '500',
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m + 3,
    marginLeft: theme.spacing.m - 6,
  },
  topViewCont: {
    marginVertical: theme.spacing.m,
    marginHorizontal: theme.spacing.l,
  },
  nameProfileCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileCont: {
    height: 40,
    width: 40,
    borderRadius: theme.borderRadii.xl,
  },
  txtUserName: {
    fontSize: theme.fontSize.m + 5,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.m - 6,
  },
  topViewSecondCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.l,
    // marginLeft: theme.spacing.xxl,
  },
  topSecondItemCont: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtTopSecondItemCont: {
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.s - 4,
    width: 150,
  },
  descriptionCont: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  txtDescription: {
    color: theme.colors.textPrimary,
  },
  imageCont: {
    // paddingHorizontal: theme.spacing.m - 6,
    marginTop: theme.spacing.m - 6,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: theme.borderRadii.l - 5,
    margin: theme.spacing.s,
  },
  postImage: {
    height: 120,
    width: 120,
    borderRadius: theme.borderRadii.l - 5,
    // margin: theme.spacing.s,
  },
  txtItmText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m - 3,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s - 4,
  },
  txtInCont: {
    flex: 1,
    height: 50,
    borderColor: theme.colors.textSecondary,
    borderWidth: 1,
    borderRadius: theme.borderRadii.m,
    paddingLeft: theme.spacing.s,
    justifyContent: 'center',
    color: theme.colors.textPrimary,
  },
  txtEdit: {
    color: theme.colors.primary,
  },
  modalHandle: { backgroundColor: theme.colors.modalHandleColor },
  modalItmCont: {
    justifyContent: 'center',
    paddingBottom: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l - 5,
    borderTopRightRadius: theme.borderRadii.l - 5,
  },
  modalTextInCont: {
    marginTop: theme.spacing.m - 6,
    minHeight: 150,
  },
  modalCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtons: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    marginTop: theme.spacing.m - 6,
  },
  selectIssueTypeCont: {
    marginVertical: theme.spacing.m - 6,
  },
  txtSelectIssueType: {
    color: theme.colors.textSecondary,
  },
  chooseMediaView: {
    marginTop: theme.spacing.m - 6,
  },
  btnClose: {
    borderRadius: theme.borderRadii.l,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m - 6 - 5,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    position: 'absolute',
    right: -8,
    top: -8,
  },
  txtCaseFileType: {
    color: theme.colors.textPrimary,
  },
  innerItmStorage: {
    height: 120,
    width: 120,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editCancelBtn: {
    width: 50,
    alignItems: 'flex-end',
  },
}));

export default InformationAboutIssue;
