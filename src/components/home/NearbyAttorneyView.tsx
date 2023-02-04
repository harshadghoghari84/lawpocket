import * as React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { makeStyles, useTheme } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Route } from 'src/constants/navigationConstants';
import { FirstCharText } from 'src/utils/common';
import { GetLawyersProps } from 'src/types/lawyers.types';

interface PracticeAreaProps {
  data: GetLawyersProps;
  index: number;
}

const NearbyAttorneyView: React.FC<PracticeAreaProps> = ({ data, index }) => {
  const navigation = useNavigation();
  const styles = useStyles();

  const { theme } = useTheme();
  const name =
    data?.firstName && data?.lastName
      ? `${data?.firstName} ${data?.lastName}`
      : data?.firstName
      ? `${data?.firstName}`
      : data?.lastName
      ? `${data?.lastName}`
      : '';
  // const location = `${data?.state || '--'}${
  //   data?.city ? ', ' + data?.city : ''
  // } `;
  const location = `${data?.state || ''} `;

  const profilePhoto = data?.profilePhoto ? { uri: data?.profilePhoto } : null;
  // const practiceArea = getPracticeArea(data?.userPracticeArea);

  const openProfileScreen = () => {
    navigation.navigate({
      name: Route.navOtherUserProfile as never,
      params: { id: data.id } as never,
    });
  };

  return (
    <TouchableOpacity onPress={openProfileScreen}>
      <View
        style={[
          styles.mainContainer,
          { marginLeft: index === 0 ? theme.spacing.m : null },
        ]}
      >
        <View style={{ flex: 1 }} />
        <View style={styles.detailContainer}>
          <View style={{ flex: 0.8 }} />

          <Text numberOfLines={1} style={styles.nameText}>
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.locationText}>
            {location}
          </Text>
          {/* <Text numberOfLines={1} style={styles.practiceAreaText}>
            {practiceArea}
          </Text> */}
        </View>

        <View style={styles.addPhotoContInner}>
          {profilePhoto ? (
            <Image source={profilePhoto} style={[styles.imageCont]} />
          ) : (
            <>
              <Text style={styles.txtName}>{FirstCharText(name)}</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useStyles = makeStyles(theme => ({
  mainContainer: {
    height: 150,
    width: 160,
    borderRadius: theme.borderRadii.s,
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.s - 2,
  },
  headerText: {
    fontSize: theme.fontSize.m + 2,
    color: theme.colors.primary,
  },
  detailContainer: {
    height: 120,
    width: '100%',
    backgroundColor: theme.colors.primaryLightest,
    borderRadius: theme.borderRadii.s + 2,
    padding: theme.spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: '600',
    fontSize: theme.fontSize.m,
    color: theme.colors.textPrimary,
  },
  locationText: {
    fontSize: theme.fontSize.m - 4,
    marginTop: theme.spacing.s - 4,
    color: theme.colors.textPrimary,
  },
  practiceAreaText: {
    fontSize: theme.fontSize.m - 4,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.s - 4,
  },
  imageCont: {
    borderRadius: 70 / 2,
    height: 70,
    width: 70,
    backgroundColor: theme.colors.lightgrey,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
  },
  txtName: {
    fontSize: theme.fontSize.l,
    fontWeight: '500',
    color: theme.colors.white,
  },
  addPhotoContInner: {
    borderRadius: 60 / 2,
    height: 60,
    width: 60,
    backgroundColor: theme.colors.grey,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default NearbyAttorneyView;
