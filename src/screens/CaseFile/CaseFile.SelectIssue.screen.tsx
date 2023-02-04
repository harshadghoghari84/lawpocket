import * as React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import Octicons from 'react-native-vector-icons/Octicons';
import { useSelector } from 'react-redux';
// relative path
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { ProgressBar } from 'src/components/ProgressBar';
import AttorneyIcon from 'src/components/svg/AttorneyIcon';
import ClientIcon from 'src/components/svg/ClientIcon';
import LawStudentIcon from 'src/components/svg/LawStudentIcon';
import constants, { CaseFileIssueType } from 'src/constants/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useCaseFile } from 'src/hooks/useCaseFile';
import { selectCaseFileLoading } from 'src/redux/caseFile/caseFile.selector';
import {
  createCaseFile,
  updateCaseFile,
} from 'src/redux/caseFile/caseFile.thunk';
import {
  caseFileSelector,
  caseFileType,
} from 'src/redux/settings/settings.selectors';
import {
  setCurrentCaseFileId,
  setSelectedCaseFileType,
} from 'src/redux/settings/settings.slice';
import { commonStyles } from 'src/screens/Authentication/Setprofile/SetProfileStyle';
import { LoadingState, ThemeProps } from 'src/types/global.types';
import { MainNavigationProps } from 'src/types/navigation.types';

interface IssueTypes {
  index: number;
  item: {
    tit: string;
    type: number;
  };
}

const issueType: { tit: string; type: number }[] = [
  { tit: 'Criminal', type: CaseFileIssueType.CRIMINAL },
  { tit: 'Civil', type: CaseFileIssueType.CIVIL },
  { tit: "I don't know", type: CaseFileIssueType.I_DONT_KNOW },
];

const SelectIssue: React.FC<MainNavigationProps<Route.navSelectIssue>> = ({
  navigation,
}) => {
  const loading = useSelector(selectCaseFileLoading);
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const { theme } = useTheme();
  const [activeType, setActiveType] = React.useState<number>(null);
  const commonStyle = commonStyles();
  const dispatch = useAppDispatch();
  // const { data: currentUser } = useMeQuery();
  const myCaseFileID = useSelector(caseFileSelector);
  const myCaseFileType = useSelector(caseFileType);

  const { refetch, data } = useCaseFile(myCaseFileID);

  React.useEffect(() => {
    if (myCaseFileID) {
      refetch().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCaseFileID]);

  React.useEffect(() => {
    if (myCaseFileType) {
      setActiveType(myCaseFileType);
    }
  }, [myCaseFileType]);

  const onContinuePress = async () => {
    // console.log('myCaseFileID', myCaseFileID);
    // console.log('activeType', activeType);
    if (activeType) {
      if (myCaseFileID) {
        const formData = new FormData();
        const customName = data?.customName ? data.customName : 'Case';

        const CASE_TITLE =
          activeType === CaseFileIssueType.CIVIL
            ? 'Civil Case'
            : activeType === CaseFileIssueType.CRIMINAL
            ? 'Criminal Case'
            : data?.caseTitle;

        const conditionalCase =
          activeType === CaseFileIssueType.I_DONT_KNOW
            ? customName
            : CASE_TITLE;

        formData.append('caseFileType', activeType);
        formData.append('caseTitle', conditionalCase);
        activeType === CaseFileIssueType.I_DONT_KNOW &&
          formData.append('customName', customName);
        console.log('FORM DATA', formData);
        const result = await dispatch(
          updateCaseFile({ formData: formData, caseFileID: myCaseFileID }),
        );
        console.log('update case file result', result);
        if (updateCaseFile.fulfilled.match(result)) {
          if (activeType === CaseFileIssueType.I_DONT_KNOW) {
            navigation.navigate(Route.navCaseFileCommonIssue);
          } else {
            navigation.navigate(Route.navCaseFileLocation);
          }
        } else {
        }
      } else {
        const formData = new FormData();

        formData.append('caseFileType', activeType);
        const result = await dispatch(createCaseFile(formData));
        if (createCaseFile.fulfilled.match(result)) {
          // setCaseFileId(result.payload.data.id);
          console.log('result.payload.data.id', result.payload.data.id);
          // add id to redux
          dispatch(setCurrentCaseFileId(`${result.payload.data.id}`));
          if (activeType === CaseFileIssueType.I_DONT_KNOW) {
            navigation.navigate(Route.navCaseFileCommonIssue);
          } else {
            navigation.navigate(Route.navCaseFileLocation);
          }
        } else {
        }
      }
    } else {
      Snackbar.show({
        text: 'please select type from above',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: theme.colors.error,
        textColor: theme.colors.white,
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader backBtn={true} title={constants.caseFile} dummy={true} />
      <View style={commonStyle.progressBarCont}>
        <ProgressBar count={33.33} totalCount={3} height={10} color={true} />
      </View>

      <View style={styles.flatListCont}>
        <Text style={styles.txtRegisterAs}>1. Select type of issue</Text>
        <FlatList
          data={issueType}
          bounces={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: IssueTypes) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setActiveType(item.type);
                  dispatch(setSelectedCaseFileType(item.type));

                  // if (item.type === CaseFileIssueType.I_DONT_KNOW) {
                  //   onContinuePress();
                  // }
                }}>
                <View
                  style={[
                    styles.FlatListItemCont,
                    {
                      borderColor:
                        activeType === item.type
                          ? theme.colors.primary
                          : theme.colors.textPrimary,
                    },
                  ]}>
                  <View style={styles.iconAndTxtCont}>
                    {index === 0 ? (
                      <ClientIcon
                        color={
                          activeType === item.type
                            ? theme.colors.primary
                            : theme.colors.grey
                        }
                      />
                    ) : index === 1 ? (
                      <LawStudentIcon
                        color={
                          activeType === item.type
                            ? theme.colors.primary
                            : theme.colors.grey
                        }
                      />
                    ) : (
                      <AttorneyIcon
                        color={
                          activeType === item.type
                            ? theme.colors.primary
                            : theme.colors.grey
                        }
                      />
                    )}

                    <Text
                      style={[
                        styles.itmTxtTitle,
                        {
                          color:
                            activeType === item.type
                              ? theme.colors.primary
                              : theme.colors.textPrimary,
                        },
                      ]}>
                      {item.tit}
                    </Text>
                  </View>
                  {activeType === item.type ? (
                    <Octicons
                      name="check"
                      size={20}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <View />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {/* {activeType === CaseFileIssueType.I_DONT_KNOW && customName !== '' && (
        <TouchableOpacity style={styles.commonIssueItemCont}>
          <Text style={styles.txtCommonIssue}>{customName}</Text>
        </TouchableOpacity>
      )} */}
      <View style={styles.btnCont}>
        <CustomButton
          disabled={loading === LoadingState.CREATE}
          loading={loading === LoadingState.CREATE}
          onPress={() => onContinuePress()}
          name={'Next'}
        />
      </View>
    </View>
  );
};

export default SelectIssue;

export const useStyles = makeStyles((theme, props: ThemeProps) => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
    paddingBottom: props.insets.bottom,
  },
  bottomSafeAreaView: {
    flex: 0,
    backgroundColor: theme.colors.bottomSafeAreaViewColor,
  },
  lgCont: { flex: 1 },
  topSafeAreaView: {
    flex: 0,
    zIndex: 999,
    backgroundColor: theme.colors.background,
  },

  topViewCont: {
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.m,
  },
  registerCont: {},
  txtRegister: {
    fontSize: theme.fontSize.l,
    color: theme.colors.textPrimary,
  },
  txtRegister2: {
    fontSize: theme.fontSize.m - 2,
    color: theme.colors.textSecondary,
  },
  flatListCont: {
    flex: 1,
    marginTop: theme.spacing.l - 4,
    marginHorizontal: theme.spacing.m,
  },
  FlatListItemCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    borderColor: theme.colors.black,
    borderWidth: 1,
    borderRadius: theme.borderRadii.m,
    marginVertical: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l - 4,
  },
  iconAndTxtCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtRegisterAs: {
    fontSize: theme.fontSize.m,
    color: theme.colors.textPrimary,
  },
  btnCont: {
    paddingBottom: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.transparent,
  },
  btnClose: {
    alignSelf: 'flex-start',
    height: 40,
    width: 40,
    justifyContent: 'center',
  },
  itmTxtTitle: { marginLeft: theme.spacing.m, fontSize: theme.fontSize.m },
  commonIssueItemCont: {
    backgroundColor: theme.colors.textInBgColor,
    height: 50,
    borderRadius: theme.borderRadii.m,
    // flex: 1,
    justifyContent: 'center',
    marginTop: theme.spacing.m,
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m - 6,
  },
  txtOtherIssue: {
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.m - 6,
  },
  txtCommonIssue: {
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.m - 6,
  },
}));
