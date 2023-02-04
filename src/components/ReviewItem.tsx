import * as React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { NameFirstChar } from 'src/components/NameFirstChar';
import StarIcon from 'src/components/svg/StarIcon';
import MoreLessText from 'src/components/MoreLessText';
import { RateReviewDataProps } from 'src/types/reviewrate.types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { Route } from 'src/constants/navigationConstants';

const ReviewItem: React.FC<RateReviewDataProps> = ({
  byUser,
  id,
  date,
  rate,
  review,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const formateDate = moment(date?.updated).format('DD/MM/YYYY');
  const STAR = [1, 2, 3, 4, 5];
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate({
          name: Route.navOtherUserProfile as never,
          params: { id: byUser?.id } as never,
        });
      }}
      key={id}
      style={[styles.itemCont, { flexDirection: 'column' }]}
    >
      <View style={styles.profCont}>
        {byUser?.profilePhoto?.length > 0 ? (
          <Image
            source={{ uri: byUser.profilePhoto }}
            style={styles.profileImg}
          />
        ) : (
          <NameFirstChar
            name={
              byUser?.firstName && byUser?.lastName
                ? `${byUser?.firstName} ${byUser?.lastName}`
                : byUser?.firstName
                ? `${byUser?.firstName}`
                : byUser?.lastName
                ? `${byUser?.lastName}`
                : ''
            }
          />
        )}

        <View style={styles.innerProfCont}>
          <Text style={styles.txtItemName}>
            {byUser?.firstName && byUser?.lastName
              ? `${byUser?.firstName} ${byUser?.lastName}`
              : byUser?.firstName
              ? `${byUser?.firstName}`
              : byUser?.lastName
              ? `${byUser?.lastName}`
              : ''}{' '}
          </Text>
          <View style={styles.nameTimeCont}>
            <View style={styles.starCont}>
              {STAR.map(item => {
                return (
                  <StarIcon
                    height={18}
                    width={18}
                    color={
                      item <= rate
                        ? theme.colors.yellowStar
                        : theme.colors.grey4
                    }
                    style={styles.starIcon}
                  />
                );
              })}
            </View>
            <Text style={{ color: theme.colors.grey }}>{formateDate}</Text>
          </View>
          <View style={styles.moreLessTxt}>
            <MoreLessText children={review} numberOfLines={3} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  itemCont: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: theme.spacing.m - 6,
    paddingHorizontal: theme.spacing.l - 4,
  },
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
    paddingLeft: theme.spacing.l - 4,
    marginTop: theme.spacing.s - 4,
  },
  txtItemName: {
    fontSize: theme.fontSize.m + 3,
    color: theme.colors.textPrimary,
    paddingLeft: theme.spacing.l - 4,
  },
  txtItemTime: {
    fontSize: theme.fontSize.m + 3,
    color: theme.colors.grey,
  },

  moreLessTxt: {
    marginTop: theme.spacing.m - 6,
    paddingLeft: theme.spacing.l - 4,
  },
  profCont: {
    flexDirection: 'row',
  },
  innerProfCont: { flex: 1 },
  starCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: { marginRight: 5 },
}));

export default ReviewItem;
