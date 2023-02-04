import * as React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import BottomSheetCaseFileSpecifyIssue from 'src/components/BottomSheetCaseFileSpecifyIssue';
import CustomButton from 'src/components/CustomButton';
// relative path
import CustomHeader from 'src/components/CustomHeader';
import { ProgressBar } from 'src/components/ProgressBar';
import BackIcon from 'src/components/svg/BackIcon';
import CheckIcon from 'src/components/svg/CheckIcon';
import { WIDTH } from 'src/constants';
import constants, { CaseFileIssueType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useCaseFile } from 'src/hooks/useCaseFile';
import { useCommonCases } from 'src/hooks/useCommonCases';
import { selectCaseFileLoading } from 'src/redux/caseFile/caseFile.selector';
import { updateCaseFile } from 'src/redux/caseFile/caseFile.thunk';
import {
  caseFileSelector,
  caseFileType,
  commanCaseFileId,
} from 'src/redux/settings/settings.selectors';
import { setSelectCommanIssueId } from 'src/redux/settings/settings.slice';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';

const CaseFileCommonIssue: React.FC<
  MainNavigationProps<Route.navCaseFileCommonIssue>
> = ({ navigation }) => {
  const loading = useSelector(selectCaseFileLoading);
  const selectedCaseFileId = useSelector(commanCaseFileId);

  console.log('selectedCaseFileId', selectedCaseFileId);
  const insets = useSafeAreaInsets();

  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const modalizeRef = React.useRef<Modalize>(null);
  const dispatch = useAppDispatch();

  const commonStyle = commonStyles({ insets });
  const { data: commonCases } = useCommonCases();
  const [selectedIssue, setSelectedIssue] = React.useState('');
  const [customName, setCustomName] = React.useState('');

  const myCaseFileID = useSelector(caseFileSelector);
  const myCaseFileType = useSelector(caseFileType);

  const { data: currentCaseFile, refetch } = useCaseFile(myCaseFileID);

  React.useEffect(() => {
    if (myCaseFileID) {
      refetch().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCaseFileID]);
  console.log('currentCaseFile', currentCaseFile);

  React.useEffect(() => {
    if (currentCaseFile) {
      setSelectedIssue(
        currentCaseFile?.customName ? currentCaseFile?.customName : '',
      );
      setCustomName(
        currentCaseFile?.customName ? currentCaseFile?.customName : '',
      );
    }
  }, [currentCaseFile]);

  const onPressNext = async () => {
    if (selectedIssue !== null) {
      const formData = new FormData();

      formData.append('customName', selectedIssue);
      formData.append('caseTitle', selectedIssue);

      const result = await dispatch(
        updateCaseFile({ formData: formData, caseFileID: myCaseFileID }),
      );

      if (updateCaseFile.fulfilled.match(result)) {
        navigation.navigate(Route.navCaseFileLocation);
      } else {
      }
    } else {
      Snackbar.show({
        text: 'please select issue from above!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.error,
        textColor: theme.colors.white,
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title={constants.caseFile} onlyHeaderTitle={true} />
      <View style={commonStyle.progressBarCont}>
        <ProgressBar count={33.33} totalCount={3} height={10} color={true} />
      </View>

      <View style={styles.flatListCont}>
        <Text style={styles.txtRegisterAs}>
          Some common issues faced by others...
        </Text>
        <FlatList
          data={commonCases}
          bounces={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedIssue(item.title);
                  dispatch(setSelectCommanIssueId(item.id));
                  setCustomName('');
                }}
                style={styles.commonIssueItemCont}>
                <Text
                  style={[
                    styles.txtCommonIssue,
                    {
                      color:
                        selectedIssue === item.title
                          ? theme.colors.textPrimary
                          : theme.colors.textSecondary,
                    },
                  ]}>
                  {item.title}
                </Text>
                {item.title === selectedIssue ? (
                  <CheckIcon color={theme.colors.primary} />
                ) : null}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {myCaseFileType === CaseFileIssueType.I_DONT_KNOW &&
        customName !== '' &&
        selectedCaseFileId === null && (
          <TouchableOpacity
            style={[
              styles.commonIssueItemCont,
              {
                marginHorizontal: theme.spacing.m,
                marginBottom: theme.spacing.m,
              },
            ]}>
            <Text
              style={[
                styles.txtCommonIssue,
                { color: theme.colors.textPrimary },
              ]}>
              {customName}
            </Text>
            <CheckIcon color={theme.colors.primary} />
          </TouchableOpacity>
        )}

      <TouchableOpacity
        onPress={() => {
          setSelectedIssue('');
          modalizeRef.current.open();
        }}
        style={styles.otherIssueCont}>
        <Text style={styles.txtOtherIssue}>
          Still have an issue? don't worry click me and Law Pocket do the rest.
        </Text>
      </TouchableOpacity>

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
          name={'Next'}
          disabled={loading === LoadingState.CREATE}
          loading={loading === LoadingState.CREATE}
          onPress={() => {
            console.log('customName', customName);
            if (customName && customName !== '') {
              navigation.navigate(Route.navCaseFileLocation);
            } else {
              onPressNext();
            }
          }}
        />
      </View>
      <BottomSheetCaseFileSpecifyIssue
        modalizeRef={modalizeRef}
        myCaseFileID={myCaseFileID}
        setCustomName={setCustomName}
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
  innerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.xl,
  },
  img: { alignSelf: 'center' },
  txtIntro: {
    fontSize: theme.fontSize.l,
    marginVertical: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  txtDescription: {
    fontSize: theme.fontSize.m,
    lineHeight: 25,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  btnCont: {
    marginVertical: theme.spacing.m,
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
  flatListCont: {
    flex: 1,
    // marginTop: theme.spacing.l - 4,
    marginHorizontal: theme.spacing.m,
  },
  txtRegisterAs: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textPrimary,
  },
  txtCommonIssue: {
    color: theme.colors.textSecondary,
    // marginLeft: theme.spacing.m - 6,
  },
  commonIssueItemCont: {
    backgroundColor: theme.colors.textInBgColor,
    height: 50,
    borderRadius: theme.borderRadii.m,
    // flex: 1,
    // justifyContent: 'center',
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
  },
  txtOtherIssue: {
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.m - 6,
  },
  otherIssueCont: {
    backgroundColor: theme.colors.primaryLight,
    marginHorizontal: theme.spacing.m,
    padding: theme.spacing.m - 6,
    borderRadius: theme.borderRadii.m,
  },
}));

export default CaseFileCommonIssue;
