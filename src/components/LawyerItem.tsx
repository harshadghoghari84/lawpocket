import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';
import { NameFirstChar } from 'src/components/NameFirstChar';
import ShareIcon from 'src/components/svg/ShareIcon';
import StarIcon from 'src/components/svg/StarIcon';
import { Route } from 'src/constants/navigationConstants';
import { useUserById } from 'src/hooks/useUserById';
import { LawyerItemProps } from 'src/types/common.types';
import { PracticeArea } from 'src/types/user.types';
import { onShare } from 'src/utils/common';

const getPracticeArea = (data: PracticeArea[]) => {
  let finalPracticeArea: string = '';
  data.map(i => {
    if (finalPracticeArea.length > 0) {
      finalPracticeArea = finalPracticeArea + ', ' + i.name;
    } else {
      finalPracticeArea = i.name;
    }
  });

  return finalPracticeArea;
};

const LawyerItem: React.FC<LawyerItemProps> = ({ item }) => {
  const { theme } = useTheme();
  const styles = useStyles();

  const navigation = useNavigation();
  const { data: userInfo } = useUserById(item.id);

  const practiceArea: string = getPracticeArea(
    userInfo?.userPracticeArea || [],
  );

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => {
        // navigation.navigate({
        //   name: Route.navLawyersProfile as never,
        //   params: { item } as never,
        // });
        navigation.navigate({
          name: Route.navOtherUserProfile as never,
          params: { id: item.id } as never,
        });
      }}
      style={styles.itemCont}
    >
      <View style={styles.profileCont}>
        {item?.profilePhoto ? (
          <Image source={{ uri: item.profilePhoto }} style={styles.profile} />
        ) : (
          <NameFirstChar
            name={
              item?.firstName && item?.lastName
                ? `${item?.firstName} ${item?.lastName}`
                : item?.firstName
                ? `${item?.firstName}`
                : item?.lastName
                ? `${item?.lastName}`
                : ''
            }
            size={70}
            fontSize={theme.fontSize.l - 5}
          />
        )}
      </View>
      <View style={styles.innerItemCont}>
        <View style={styles.nameRateCont}>
          <Text style={styles.txtName}>
            {item?.firstName && item?.lastName
              ? `${item?.firstName} ${item?.lastName}`
              : item?.firstName
              ? `${item?.firstName}`
              : item?.lastName
              ? `${item?.lastName}`
              : ''}
          </Text>
          <View style={styles.ratingCont}>
            <TouchableOpacity
              style={styles.shareCont}
              onPress={() => onShare(`${item.id}`)}
            >
              <ShareIcon color={theme.colors.primary} height={15} width={15} />
            </TouchableOpacity>
            {/* <Text style={styles.txtRating}>{item.ratingReview}</Text> */}
          </View>
        </View>
        {item?.userPracticeArea.length > 0 ? (
          <View style={styles.practiceAreaCont}>
            <Entypo name="briefcase" size={16} color={theme.colors.primary} />
            <Text numberOfLines={1} style={styles.txtPracticeArea}>
              {practiceArea}
            </Text>
          </View>
        ) : null}
        <View style={styles.innerItemSecondCont}>
          <View style={styles.locationCont}>
            <Icon
              name="location-sharp"
              size={16}
              color={theme.colors.primary}
            />
            <Text numberOfLines={1} style={styles.txtLocation}>
              {item?.state ? `${item?.state}` : ''}
            </Text>
          </View>
          <View style={styles.ratingCont}>
            <StarIcon color={theme.colors.primary} height={12} width={12} />
            <Text style={styles.txtRating}>{item.ratingReview}</Text>
          </View>
          {/* {item?.myCustomer && (
            <View style={styles.locationCont}>
              <Entypo name="briefcase" size={16} color={theme.colors.primary} />
              <Text style={styles.txtLocation}>{item.myCustomer}</Text>
            </View>
          )}
          {item?.rateOfHour && (
            <View style={styles.locationCont}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.txtLocation}>{item.rateOfHour}</Text>
            </View>
          )} */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  txtItemName: {
    fontSize: theme.fontSize.m,
    marginLeft: theme.spacing.m - 6,
    color: theme.colors.textPrimary,
  },
  txtItemData: {
    fontSize: theme.fontSize.m,
    marginRight: theme.spacing.m - 6,
    color: theme.colors.primary,
  },
  itemCont: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.m,
    marginVertical: theme.spacing.m - 6,
    flex: 1,
  },
  innerItmCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    height: 70,
    width: 70,
    borderRadius: theme.borderRadii.xxl,
  },
  profileCont: {
    height: 80,
    width: 80,
    borderRadius: theme.borderRadii.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.textInBgColor,
    marginRight: theme.spacing.s,
  },
  innerItemCont: {
    flex: 1,
  },
  ratingCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRateCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txtRating: {
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.s,
  },
  txtName: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    fontWeight: '600',
  },
  txtLocation: {
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.s,
    width: 100,
  },
  txtPracticeArea: {
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.s,
    // width: 100,
    flex: 1,
  },
  locationCont: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
  },
  innerItemSecondCont: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing.s,
  },
  practiceAreaCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.s,
    flex: 1,
    // width: '80%',
  },
  shareCont: {
    padding: theme.spacing.s,
  },
}));

export default LawyerItem;
