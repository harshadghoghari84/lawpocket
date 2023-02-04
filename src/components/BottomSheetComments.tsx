import moment from 'moment';
import * as React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Portal } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalFooter from 'src/components/BottomSheetFooter';
import ModalHeader from 'src/components/BottomSheetHeader';
import { Divider } from 'src/components/Divider';
import { NameFirstChar } from 'src/components/NameFirstChar';
import { NoDataFound } from 'src/components/ui/NoDataFound';
import { WIDTH } from 'src/constants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useFeedById } from 'src/hooks/useFeeds';
import { feedComment } from 'src/redux/feeds/feeds.thunk';
import { ThemeProps } from 'src/types/global.types';

export interface BottomSheetCommentsProps {
  modalizeRef: React.MutableRefObject<IHandles>;
  title?: string;
  id: number;
  setRefetch: (val: boolean) => void;
}

const BottomSheetComments: React.FC<BottomSheetCommentsProps> = ({
  modalizeRef,
  title,
  id,
  setRefetch,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles({ insets });
  const dispatch = useAppDispatch();

  const { data: commentData, refetch, isLoading } = useFeedById(id);

  React.useEffect(() => {
    refetch().then();
  }, [id, refetch]);

  const [comments, setComments] = React.useState<string>('');

  const onPressSend = async () => {
    try {
      const result = await dispatch(
        feedComment({ feedId: id, comment: comments }),
      );
      if (feedComment.fulfilled.match(result)) {
        refetch().then();
        setComments('');
        setRefetch(true);
        // modalizeSaveRef.current?.open();
      } else {
      }
    } catch (error) {}
  };

  const onPressNodata = () => {
    refetch().then();
  };

  return (
    <Portal>
      <Modalize
        adjustToContentHeight={true}
        ref={modalizeRef}
        disableScrollIfPossible={false}
        handlePosition="inside"
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          bounces: false,
        }}
        handleStyle={styles.modalHandleStyle}
        FooterComponent={() => (
          <View style={styles.modalHeaderWrap}>
            <View style={styles.footerCont}>
              <TextInput
                placeholder="Write Comment"
                placeholderTextColor={theme.colors.grey}
                style={styles.textIn}
                value={comments}
                onChangeText={(val: string) => setComments(val)}
              />
              <TouchableOpacity
                onPress={() => {
                  if (comments.trim() !== '' && comments.length > 0) {
                    onPressSend();
                  }
                }}
                style={styles.btnSend}>
                <Icon name="send" size={25} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <ModalFooter />
          </View>
        )}
        HeaderComponent={() => <ModalHeader title={title} />}>
        <>
          <View style={styles.modalCont}>
            {commentData?.comments?.length > 0 ? (
              commentData?.comments?.map((item, index) => {
                const name = item.admin
                  ? item?.admin?.name
                  : item?.user?.firstName && item?.user?.lastName
                  ? `${item?.user?.firstName} ${item?.user?.lastName}`
                  : item?.user?.firstName
                  ? `${item?.user?.firstName}`
                  : item?.user?.lastName
                  ? `${item?.user?.lastName}`
                  : '';

                const profile = item.admin
                  ? require('src/helper/image/lpAppIcon.png')
                  : item.user.profilePhoto
                  ? { uri: item.user.profilePhoto }
                  : null;

                let dateTime = '';
                let newDate = new Date().setHours(0, 0, 0, 0);
                let oldDate = new Date(item?.date?.updated).setHours(
                  0,
                  0,
                  0,
                  0,
                );
                if (newDate <= oldDate) {
                  dateTime = moment(item?.date?.updated).format('hh:mm A');
                } else {
                  dateTime = moment(item?.date?.updated).format(
                    'hh:mm A DD/MM/YYYY',
                  );
                }

                return (
                  <View style={styles.itmCont}>
                    <View style={styles.profileCont}>
                      {profile ? (
                        <Image source={profile} style={styles.profileImg} />
                      ) : (
                        <NameFirstChar name={name} />
                      )}
                      <View style={styles.itmNameTimeCont}>
                        <View style={styles.nameTimeCont}>
                          <Text style={styles.txtItemName}>{name}</Text>
                        </View>
                        <View style={styles.nameTimeCont}>
                          <Text style={{ color: theme.colors.grey }}>
                            {dateTime}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.txtDiscMoreLess}>
                      <Text style={styles.txtDescription}>{item.comment}</Text>
                    </View>
                    {index !== commentData?.comments?.length - 1 && <Divider />}
                  </View>
                );
              })
            ) : (
              <NoDataFound
                loading={isLoading}
                onPress={() => onPressNodata()}
                noDataText={'No comments!'}
                noDataIcon={
                  <Image
                    source={require('src/helper/image/noComments.png')}
                    style={styles.noDataIcons}
                  />
                }
              />
            )}
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
    paddingBottom: props.insets.bottom,
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
  modalHeaderWrap: {
    backgroundColor: theme.colors.background,
  },
  noDataFoundCont: {
    flex: 1,
    height: WIDTH / 2,
    margin: theme.spacing.m,
    backgroundColor: theme.colors.textInBgColor,
    borderRadius: theme.borderRadii.m,
  },
  noDataIcons: {
    height: 60,
    width: 60,
  },
}));

export default BottomSheetComments;
