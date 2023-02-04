import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { ImageSourcePropType, Text, TextInput, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';
import ModalHeader from 'src/components/BottomSheetHeader';
import CustomButton from 'src/components/CustomButton';
import { WIDTH } from 'src/constants';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { selectCaseFileLoading } from 'src/redux/caseFile/caseFile.selector';
import { updateCaseFile } from 'src/redux/caseFile/caseFile.thunk';
import { setSelectCommanIssueId } from 'src/redux/settings/settings.slice';
import { LoadingState, ThemeProps } from 'src/types/global.types';

export type modalDataProps = {
  _id: number;
  time: string;
  profile: string;
  name: string;
  description: string;
  image?: { img: string }[];
  video?: string;
};

export interface BottomSheetCaseFileSpecifyIssueProps {
  modalizeRef: React.MutableRefObject<IHandles>;
  title?: string;
  data?: modalDataProps[];
  myCaseFileID?: string;
  setCustomName: (val: string) => void;
}

export type CommentDataItemProps = {
  profile: ImageSourcePropType;
  name: number;
  description: number;
};

const BottomSheetCaseFileSpecifyIssue: React.FC<
  BottomSheetCaseFileSpecifyIssueProps
> = ({ modalizeRef, myCaseFileID, setCustomName }) => {
  const loading = useSelector(selectCaseFileLoading);

  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState<string>('');

  const onPressSubmit = async () => {
    if (value !== null) {
      const formData = new FormData();

      formData.append('customName', value);
      formData.append('caseTitle', value);

      const result = await dispatch(
        updateCaseFile({ formData: formData, caseFileID: myCaseFileID }),
      );

      if (updateCaseFile.fulfilled.match(result)) {
        setCustomName(value);
        dispatch(setSelectCommanIssueId(null));
        modalizeRef.current?.close();
        navigation.navigate({
          name: Route.navCaseFileLocation as never,
          params: {} as never,
        });
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
    <Portal>
      <Modalize
        adjustToContentHeight
        ref={modalizeRef}
        disableScrollIfPossible={false}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          bounces: false,
        }}
        handlePosition={'inside'}
        handleStyle={styles.modalHandleStyle}
        HeaderComponent={() => <ModalHeader />}>
        <>
          <View style={styles.modalCont}>
            <Text style={styles.txtSpecifyIssue}>Specify your issue</Text>
            <View style={styles.modalTextInCont}>
              <TextInput
                placeholder="Write issue here"
                placeholderTextColor={theme.colors.grey}
                value={value}
                onChangeText={val => setValue(val)}
                multiline
                style={styles.textInCont}
              />
              <View style={styles.modalButtons}>
                <CustomButton
                  height={40}
                  smallBtn={WIDTH / 2 - 50}
                  borderBtn={true}
                  name={'Cancel'}
                  onPress={() => modalizeRef.current.close()}
                />
                <CustomButton
                  height={40}
                  smallBtn={WIDTH / 2 - 50}
                  borderBtn={false}
                  name={'submit'}
                  disabled={loading === LoadingState.CREATE}
                  loading={loading === LoadingState.CREATE}
                  onPress={() => onPressSubmit()}
                />
              </View>
            </View>
          </View>
        </>
      </Modalize>
    </Portal>
  );
};

const useStyles = makeStyles((theme, props: ThemeProps) => ({
  safeArea: {
    backgroundColor: theme.colors.background,
  },
  modalCont: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.l - 4,
    paddingBottom: props.insets.bottom + theme.spacing.s,
  },
  modalHandleStyle: { backgroundColor: theme.colors.modalHandleColor },
  modalHeaderCont: {
    width: '100%',
    paddingHorizontal: theme.spacing.m - 6 + 5,
    paddingVertical: theme.spacing.m - 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalCloseCont: {
    height: 50,
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  txtTitle: {
    color: theme.colors.grey,
    marginTop: theme.spacing.l - 4,
    fontSize: theme.fontSize.l,
  },
  txtSuccess: {
    fontSize: theme.fontSize.l,
    fontWeight: '600',
  },
  markCont: {
    height: 100,
    width: 100,
    borderRadius: theme.borderRadii.l + 50,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.l - 4,
  },
  txtStateCity: {
    fontSize: theme.fontSize.m + 4,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  dummyView: {
    width: 50,
  },
  footerCont: {
    height: 50,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.headerBottomLineColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textIn: {
    height: 50,
    flex: 1,
    paddingLeft: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
  },
  btnSend: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollCont: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.l - 4 * 5,
  },
  profileCont: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.l - 4,
    alignItems: 'center',
  },
  itmNameTimeCont: { flex: 1 },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.xl,
  },
  nameTimeCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    height: 10,
    paddingLeft: theme.spacing.l - 4,
  },
  txtItemName: {
    fontSize: theme.fontSize.m + 3,
    color: theme.colors.textPrimary,
  },
  txtItemTime: {
    fontSize: theme.fontSize.m + 2,
    color: theme.colors.grey,
  },
  txtDiscMoreLess: {
    marginVertical: theme.spacing.l - 4,

    paddingHorizontal: theme.spacing.l - 4,
  },
  itmCont: {
    marginVertical: theme.spacing.m - 6,
  },
  txtDescription: {
    color: theme.colors.textSecondary,
  },
  modalHeaderWrap: { backgroundColor: theme.colors.background },
  modalTextInCont: { marginTop: theme.spacing.m - 6 },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m - 6,
  },
  textInCont: {
    height: 150,
    borderRadius: theme.borderRadii.m,
    backgroundColor: theme.colors.textInBgColor,
    padding: theme.spacing.m,
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    color: theme.colors.textPrimary,
  },
  txtSpecifyIssue: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
  },
}));

export default BottomSheetCaseFileSpecifyIssue;
