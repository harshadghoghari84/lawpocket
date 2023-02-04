import * as React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import BottomSheetChooseImage from 'src/components/BottomSheetChooseImage';
import ChooseItems from 'src/components/ChooseItems';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { ProgressBar } from 'src/components/ProgressBar';
import AttachmentIcon from 'src/components/svg/AttachmentIcon';
import BackIcon from 'src/components/svg/BackIcon';
import CloseIcon from 'src/components/svg/CloseIcon';
import PdfIcon from 'src/components/svg/PdfIcon';
import { WIDTH } from 'src/constants';
import constants from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useCaseFile } from 'src/hooks/useCaseFile';
import { selectCaseFileLoading } from 'src/redux/caseFile/caseFile.selector';
import { updateCaseFile } from 'src/redux/caseFile/caseFile.thunk';
import { caseFileSelector } from 'src/redux/settings/settings.selectors';
import { setSelectCommanIssueId } from 'src/redux/settings/settings.slice';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { ImageProps } from 'src/screens/EditPost.screen';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';
import { getFilename, getUrlExtension } from 'src/utils/common';

const CaseFileDescription: React.FC<
  MainNavigationProps<Route.navCaseFileDescription>
> = ({ navigation }) => {
  const loading = useSelector(selectCaseFileLoading);
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const commonStyle = commonStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const myCaseFileID = useSelector(caseFileSelector);

  const modalChooseImageRef = React.useRef<Modalize>(null);
  const [image, setImage] = React.useState<ImageProps[]>([]);
  const [value, setValue] = React.useState('');
  // const [pauseVideo, setPauseVideo] = React.useState<boolean>(true);

  const { data: currentCaseFile, refetch } = useCaseFile(myCaseFileID);

  React.useEffect(() => {
    if (myCaseFileID) {
      refetch().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCaseFileID]);

  React.useEffect(() => {
    if (currentCaseFile) {
      setValue(currentCaseFile?.caseTitle);
      currentCaseFile?.documents.length > 0 &&
        setImage(currentCaseFile?.documents);
    }
  }, [currentCaseFile]);

  const onPressSubmit = async () => {
    try {
      if (value && value !== '' && image.length > 0) {
        const formData = new FormData();

        formData.append('caseTitle', value);
        Object.entries(image).forEach(([_key, val]) => {
          formData.append('documents', {
            name:
              getFilename(val.name) === 'MOV'
                ? val.name.replace('MOV', 'mp4')
                : val.name || `IMG-${new Date()}.${getUrlExtension(val.uri)}`,
            type: val.mimetype,
            uri:
              Platform.OS === 'ios' ? val.uri.replace('file://', '') : val.uri,
          });
        });
        const result = await dispatch(
          updateCaseFile({ formData: formData, caseFileID: myCaseFileID }),
        );

        if (updateCaseFile.fulfilled.match(result)) {
          // dispatch(setCurrentCaseFileId(''));
          dispatch(setSelectCommanIssueId(null));

          navigation.navigate(Route.navCaseFileCheckData);
        } else {
        }
      } else {
        Snackbar.show({
          text: 'case title and documents are require!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: theme.colors.error,
          textColor: theme.colors.white,
        });
      }
    } catch (error) {
      Snackbar.show({
        text: error,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.error,
        textColor: theme.colors.white,
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader onlyHeaderTitle={true} title={constants.caseFile} />
      <View style={commonStyle.progressBarCont}>
        <ProgressBar count={100} totalCount={5} height={10} color={true} />
      </View>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        style={styles.scrollCont}>
        <Text style={commonStyle.txtTitle}>3. Case title</Text>
        <View style={styles.stateCityCont}>
          <TextInput
            placeholder="Write here"
            multiline={true}
            value={value}
            onChangeText={val => setValue(val)}
            placeholderTextColor={theme.colors.grey}
            style={styles.txtInput}
            returnKeyType="done"
          />
          <View style={styles.chooseMediaView}>
            <Text style={styles.txtChooseMedia}>Upload document</Text>
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
                  <TouchableOpacity
                    onPress={() => {
                      var array = [...image];
                      var index = array.indexOf(item);
                      if (index !== -1) {
                        array.splice(index, 1);
                        setImage(array);
                      }
                    }}
                    style={styles.btnClose}>
                    <CloseIcon
                      color={theme.colors.black}
                      height={12}
                      width={12}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={commonStyle.bottomCont}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={commonStyle.backCont}>
          <BackIcon color={theme.colors.grey} />
        </TouchableOpacity>
        <CustomButton
          smallBtn={WIDTH - 110}
          name={'Submit'}
          disabled={loading === LoadingState.CREATE}
          loading={loading === LoadingState.CREATE}
          onPress={() => onPressSubmit()}
        />
      </View>
      <BottomSheetChooseImage
        modalizeRef={modalChooseImageRef}
        multiple={true}
        setImage={setImage}
        image={image}
      />
    </View>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  scrollCont: {
    flexGrow: 1,
  },
  stateCityCont: {
    flex: 1,
    marginTop: theme.spacing.l - 4,
    marginHorizontal: theme.spacing.l - 4,
  },
  vState: {
    backgroundColor: theme.colors.lightestGrey,
    height: 50,
    borderRadius: theme.borderRadii.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m - 6,
    marginBottom: theme.spacing.l - 4,
  },
  iconAndTxtCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: theme.colors.grey,
    marginLeft: theme.spacing.m - 6,
    fontSize: theme.fontSize.m,
  },
  modalizeCont: {
    paddingHorizontal: theme.spacing.m,
    justifyContent: 'center',
    flex: 1,
    paddingBottom: theme.spacing.l - 4,
    backgroundColor: theme.colors.background,
  },
  modalHeaderMainCont: {
    marginHorizontal: theme.spacing.m,
    marginVertical: theme.spacing.m,
    justifyContent: 'center',
  },
  modalHeaderCont: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
  },
  txtStateCity: {
    fontSize: theme.fontSize.m + 4,
    fontWeight: '700',
    color: theme.colors.black,
  },
  modalCloseCont: {
    height: 40,
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  dummyView: {
    width: 50,
  },
  selectStateCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
  },
  vStateCity: {
    marginTop: theme.spacing.m - 6,
    // height: '100%',
  },
  modalHandle: {
    backgroundColor: theme.colors.transparent,
  },
  noDataFoundCont: {
    alignItems: 'center',
    justifyContent: 'center',
    height: WIDTH + WIDTH / 2,
  },
  txtNoDataFound: {
    color: theme.colors.textPrimary,
  },
  safeAreaView: {
    paddingBottom: theme.spacing.m - 6,
    backgroundColor: theme.colors.background,
  },
  headerComponent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l - 5,
    borderTopRightRadius: theme.borderRadii.l - 5,
  },
  headerComponentTextIn: { marginHorizontal: theme.spacing.m - 6 },
  modalStyle: { backgroundColor: theme.colors.background },
  txtInput: {
    height: 100,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.m,
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    padding: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
  },
  txtChooseMedia: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m - 3,
    marginVertical: theme.spacing.m - 6,
  },
  chooseMediaView: {
    marginTop: theme.spacing.m - 6,
  },
  imageCont: {
    // paddingHorizontal: theme.spacing.m - 6,
    paddingVertical: theme.spacing.m - 6,
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
    backgroundColor: theme.colors.textInBgColor,
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
  pausePlayCont: {
    position: 'absolute',
    // height: 200,
    // width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    // backgroundColor: 'red',
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
}));

export default CaseFileDescription;
