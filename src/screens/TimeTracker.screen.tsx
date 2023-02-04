import * as React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
// relative path
import { makeStyles, useTheme } from 'react-native-elements';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalFooter from 'src/components/BottomSheetFooter';
import ModalHeader from 'src/components/BottomSheetHeader';
import CustomButton from 'src/components/CustomButton';
import CustomHeader from 'src/components/CustomHeader';
import { Divider } from 'src/components/Divider';
import CheckIcon from 'src/components/svg/CheckIcon';
import { WIDTH } from 'src/constants';
import BackgroundTimer from 'react-native-background-timer';
import { useEffect } from 'react';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { timerSelector } from 'src/redux/settings/settings.selectors';
import { setTimer } from 'src/redux/settings/settings.slice';
import { secsToTime } from 'src/utils/common';

interface ChatDataProps {
  profile: string;
  time: string;
  mail: string;
  name: string;
  hrs: string;
  date: Date;
}

const RecentChatData: ChatDataProps[] = [
  {
    profile:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    time: '6:30 pm',
    mail: 'jameswhite12@gmail.com',
    name: 'James While',
    hrs: '02:23',
    date: new Date(),
  },
  {
    profile:
      'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fA%3D%3D&w=1000&q=80',

    time: '4:30 pm',
    mail: 'adamclark12@gmail.com',
    name: 'Adam Clark',
    hrs: '01:13',
    date: new Date(2021, 1, 30),
  },
  {
    profile:
      'https://us.123rf.com/450wm/fizkes/fizkes2007/fizkes200701793/152407909-profile-picture-of-smiling-young-caucasian-man-in-glasses-show-optimism-positive-and-motivation-head.jpg?ver=6',

    time: '1:35 pm',
    mail: 'victoriamartin12@gmail.com',
    name: 'Victoria Martin',
    hrs: '00:31',
    date: new Date(2021, 1, 30),
  },
];

const TimeTracker: React.FC = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const modalizeRef = React.useRef<Modalize>(null);
  // const [value, setValue] = React.useState('key1');
  const [selectedCase, setSelectedCase] = React.useState<ChatDataProps>();

  const [value, setValue] = React.useState<string | string[]>('today');
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<ItemType[]>([
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
  ]);
  // const [seconds, setSeconds] = React.useState<number>(0);
  const [time, setTime] = React.useState<string>('0');

  const dispatch = useAppDispatch();
  const timer = useSelector(timerSelector);

  useEffect(() => {
    let timing = secsToTime(timer);
    setTime(timing);
  }, [timer]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader backBtn={true} title={'Time Tracker'} dummy={true} />
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        style={styles.scrollCont}
      >
        <View style={styles.topCont}>
          <View style={styles.todayHrCont}>
            <Text style={styles.txtToday}>Today's</Text>
            <Text style={styles.txtTime}>4:23 hrs</Text>
          </View>
          <View style={styles.thisWeekHrCont}>
            <Text style={styles.txtThisWeek}>This Week's</Text>
            <Text style={styles.txtTime}>20:30 hrs</Text>
          </View>
        </View>
        <Divider />
        <View style={styles.currSessionCont}>
          <Text style={styles.txtCurSess}>Current session</Text>
          <View style={styles.firstCont}>
            <View style={styles.profileNameCont}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                }}
                style={styles.profileImg}
              />
              <View style={styles.txtCont}>
                <Text style={styles.txtName}>James White</Text>
                <Text style={styles.txtMail}>jameswhite12@gmail.com</Text>
              </View>
            </View>
            <Entypo
              name="chevron-thin-down"
              size={20}
              color={theme.colors.grey}
            />
          </View>
          <View style={styles.timerCont}>
            <View style={styles.timIconCont}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={30}
                color={theme.colors.iconColor}
                style={styles.iconTracker}
              />
              {/*<Text style={styles.time}>00:00:00</Text>*/}
              <Text style={styles.time}>{time}</Text>
            </View>
            <CustomButton
              name="Start"
              smallBtn={WIDTH / 3}
              borderRadius={theme.borderRadii.m + 3}
              onPress={() => {
                BackgroundTimer.runBackgroundTimer(() => {
                  // setSeconds(prevTimer => prevTimer + 1);
                  dispatch(setTimer(1));
                }, 1000);
              }}
            />
          </View>
        </View>
        <Divider />

        <View style={styles.innerHistoryCont}>
          <Text style={styles.txtHistory}>History</Text>

          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            placeholder="Today"
            setItems={setItems}
            labelStyle={styles.ddTxtLabel}
            style={styles.ddStyle}
            dropDownContainerStyle={styles.ddCont}
            zIndex={6000}
            listMode="SCROLLVIEW"
            containerStyle={styles.ddContStyle}
            ArrowDownIconComponent={() => (
              <Entypo
                name="chevron-thin-down"
                size={18}
                color={theme.colors.primary}
              />
            )}
            ArrowUpIconComponent={() => (
              <Entypo
                name="chevron-thin-up"
                size={18}
                color={theme.colors.primary}
              />
            )}
            TickIconComponent={() => <CheckIcon color={theme.colors.primary} />}
            closeAfterSelecting
            textStyle={{ color: theme.colors.textPrimary }}
          />
        </View>
        {RecentChatData.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedCase(item);
                modalizeRef.current?.open();
              }}
              activeOpacity={0.6}
              key={index}
              style={styles.itmCont}
            >
              <View style={styles.profileNameCont}>
                <Image
                  source={{ uri: item.profile }}
                  style={styles.profileImg}
                />
                <View style={styles.txtCont}>
                  <Text style={styles.txtName}>{item.name}</Text>
                  <Text numberOfLines={1} style={styles.txtMail}>
                    {item.mail}
                  </Text>
                </View>
              </View>
              <View style={styles.hrsTimeCont}>
                <View style={styles.txtTimeHrsCont}>
                  <Text style={styles.txtHrs}>{item.hrs} hrs</Text>
                  <Text style={styles.txtTim}>{item.time}</Text>
                </View>
                <Entypo
                  name="chevron-thin-right"
                  size={20}
                  color={theme.colors.primary}
                  style={{ marginLeft: theme.spacing.s - 6 }}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          handleStyle={styles.modalHandleStyle}
          disableScrollIfPossible={false}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
            bounces: false,
          }}
          FooterComponent={() => <ModalFooter />}
          HeaderComponent={() => (
            <ModalHeader
              modalizeRef={modalizeRef}
              title={selectedCase?.name}
              profile={selectedCase?.profile}
            />
          )}
        >
          <>
            {/* <StatusBar showHideTransition="none" hidden /> */}

            <View style={styles.qrModalCont}>
              <View style={styles.topCont}>
                <View style={styles.todayHrCont}>
                  <Text style={styles.txtToday}>Today's</Text>
                  <Text style={styles.txtTime}>4:23 hrs</Text>
                </View>
                <View style={styles.thisWeekHrCont}>
                  <Text style={styles.txtThisWeek}>This Week's</Text>
                  <Text style={styles.txtTime}>20:30 hrs</Text>
                </View>
              </View>
              <Divider />
              <View style={styles.lstTracker}>
                <Text style={styles.txtDay}>Today</Text>
                <View style={styles.modalTimerCont}>
                  <Text style={styles.txtTimePeriod}>10:00 AM to 10:35 AM</Text>
                  <Text style={styles.countDownTimer}>00:35:25</Text>
                </View>
                <Text style={styles.txtDisc}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
                <View style={styles.modalTimerCont}>
                  <Text style={styles.txtTimePeriod}>11:50 AM to 12:25 AM</Text>
                  <Text style={styles.countDownTimer}>00:35:05</Text>
                </View>
                <Text style={styles.txtDisc}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
              <Divider />
              <View style={styles.lstTracker}>
                <Text style={styles.txtDay}>Yesterday</Text>
                <View style={styles.modalTimerCont}>
                  <Text style={styles.txtTimePeriod}>10:00 AM to 10:55 AM</Text>
                  <Text style={styles.countDownTimer}>00:55:25</Text>
                </View>
                <Text style={styles.txtDisc}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
              <Divider />
              <View style={styles.lstTracker}>
                <Text style={styles.txtDay}>12/09/2021</Text>
                <View style={styles.modalTimerCont}>
                  <Text style={styles.txtTimePeriod}>10:00 AM to 10:35 AM</Text>
                  <Text style={styles.countDownTimer}>00:35:25</Text>
                </View>
                <Text style={styles.txtDisc}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
                <View style={styles.modalTimerCont}>
                  <Text style={styles.txtTimePeriod}>11:50 AM to 12:25 AM</Text>
                  <Text style={styles.countDownTimer}>00:35:05</Text>
                </View>
                <Text style={styles.txtDisc}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Text>
              </View>
            </View>
          </>
        </Modalize>
      </Portal>
    </SafeAreaView>
  );
};

export default TimeTracker;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  topCont: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.l - 4,
    paddingVertical: theme.spacing.l - 4,
  },
  todayHrCont: {
    flex: 1,
  },
  thisWeekHrCont: {
    flex: 1,
  },
  txtToday: {
    color: theme.colors.grey,
  },
  txtThisWeek: {
    color: theme.colors.grey,
  },
  txtTime: {
    fontSize: theme.fontSize.m,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  currSessionCont: {
    paddingVertical: theme.spacing.l - 4,
    paddingHorizontal: theme.spacing.l - 4,
  },
  firstCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: theme.borderRadii.xl,
  },
  itmCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.m + 4,
    marginVertical: theme.spacing.m - 6,
    justifyContent: 'space-between',
    zIndex: -1,
  },
  txtCase: {
    fontSize: theme.fontSize.l,
    color: theme.colors.grey,
  },
  txtMail: {
    fontSize: theme.fontSize.m - 3,
    color: theme.colors.grey,
    marginTop: theme.spacing.s - 6,
  },
  txtName: {
    fontSize: theme.fontSize.m + 3,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  txtCont: {
    marginLeft: theme.spacing.m - 6,
  },
  profileNameCont: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
  },
  txtCurSess: {
    fontSize: theme.fontSize.m + 3,
    fontWeight: '500',
    marginBottom: theme.spacing.l - 4,
    color: theme.colors.textPrimary,
  },
  timerCont: {
    backgroundColor: theme.colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.l - 4,
    marginTop: theme.spacing.l - 4,
    borderRadius: theme.borderRadii.l,
  },
  timIconCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTracker: {
    marginRight: theme.spacing.m - 6,
  },
  time: {
    fontSize: theme.fontSize.l - 4,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  selectDayCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerHistoryCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l - 4,
    marginBottom: theme.spacing.m - 6,
  },
  txtSelectDay: {
    color: theme.colors.primary,
  },
  txtHistory: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m + 3,
    fontWeight: '600',
    marginVertical: theme.spacing.m - 6,
  },
  scrollCont: { flexGrow: 1 },
  txtHrs: {
    fontSize: theme.fontSize.m + 2,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  txtTim: {
    fontSize: theme.fontSize.m - 3,
    color: theme.colors.grey,
    marginTop: theme.spacing.m - 6 - 5,
  },
  hrsTimeCont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtTimeHrsCont: {
    alignItems: 'flex-end',
  },
  modalHandleStyle: { backgroundColor: theme.colors.transparent },
  modalStyle: {
    backgroundColor: theme.colors.transparent,
  },
  headerQrModal: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadii.l,
    borderTopRightRadius: theme.borderRadii.l,
  },
  txtQrCode: {
    fontSize: theme.fontSize.m + 2,
    fontWeight: '500',
    marginLeft: theme.spacing.m - 6,
    color: theme.colors.black,
  },
  qrModalDummyView: {
    width: 30,
  },
  qrModalCont: {
    backgroundColor: theme.colors.background,
    // paddingBottom: theme.spacing.l - 4,
    flex: 1,
  },
  lstTracker: {
    paddingVertical: theme.spacing.l - 4,
    paddingHorizontal: theme.spacing.l - 4,
  },
  txtDay: {
    fontSize: theme.fontSize.m,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  countDownTimer: {
    color: theme.colors.primary,

    fontWeight: '500',
  },
  txtDisc: {
    color: theme.colors.grey,
    marginVertical: theme.spacing.m - 6,
  },
  modalTimerCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m - 6,
  },
  headerTimerNameProfile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imgHeader: { height: 30, width: 30, borderRadius: 60 },
  txtTimePeriod: {
    color: theme.colors.textPrimary,
  },
  ddOutCont: {
    width: '35%',
    minHeight: 150,
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    right: theme.spacing.m + 4,
    top: theme.spacing.m - 6,
  },
  ddTxtLabel: { color: theme.colors.primary },
  ddStyle: { borderWidth: 0, backgroundColor: theme.colors.background },
  ddCont: {
    backgroundColor: theme.colors.background,
    borderWidth: 0,
    shadowColor: theme.colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  ddContStyle: {
    borderWidth: 0,
    width: '35%',
    minHeight: 150,
    position: 'absolute',
    right: 20,
    top: 0,
  },
  ddItmSep: {
    width: '80%',
    alignSelf: 'center',
  },
  safeAreaView: { paddingBottom: theme.spacing.m - 6 },
}));
