import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// relative path
import { CheckBox, makeStyles, useTheme } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import CustomHeader from 'src/components/CustomHeader';
import CheckIcon from 'src/components/svg/CheckIcon';
import PdfIcon from 'src/components/svg/PdfIcon';
import { Route } from 'src/constants/navigationConstants';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { selectStorage } from 'src/redux/settings/settings.selectors';
import { selectedFiles } from 'src/redux/settings/settings.slice';
import { MainNavigationProps } from 'src/types/navigation.types';
import { SelectedFilesProps, StorageItemProps } from 'src/types/settings.types';
import { getUrlExtension } from 'src/utils/common';

const Storage: React.FC<MainNavigationProps<Route.navStorage>> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const StorageData = useSelector(selectStorage);
  const { theme } = useTheme();
  const [activeItem, setActiveItem] = useState<SelectedFilesProps>({
    myPocketId: '',
    caseId: '',
    fileType: '',
    fileName: '',
  });

  console.log('activeItem', activeItem);
  const [activeBtn, setActiveBtn] = useState<boolean>(false);
  const [activeCheckBox, setActiveCheckBox] = useState<boolean>(false);

  const styles = useStyles();

  useEffect(() => {
    setActiveCheckBox(route?.params?.activeAdd);
  }, [route]);

  useEffect(() => {
    if (activeItem.myPocketId || activeItem.caseId) {
      setActiveBtn(true);
    } else {
      setActiveBtn(false);
    }
  }, [activeItem]);

  // useEffect(() => {
  //   dispatch(selectedFiles({ id: '', docType: '' }));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const onPressAdd = () => {
    dispatch(selectedFiles(activeItem));
    navigation.goBack();
  };
  const onPressCheckBox = (item: StorageItemProps) => {
    setActiveItem({
      myPocketId: item?.myPocketId ? item.myPocketId : '',
      caseId: item?.caseId ? item.caseId : '',
      fileType: item.fileType,
      fileName: item.fileName,
    });
    // if (activeItem.includes(item.id)) {
    //   let filterArr = activeItem.filter((itm: string) => itm !== item.id);
    //   setActiveItem(filterArr);
    // } else {
    //   setActiveItem([...activeItem, item.id]);
    // }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        backBtn={true}
        title="Storage"
        add={activeBtn}
        dummy={activeBtn === true ? false : true}
        onPress={() => onPressAdd()}
      />
      <Text style={styles.txtAvailableDoc}>
        {StorageData.all?.length} document available
      </Text>
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        style={styles.scrollCont}
      >
        <View style={styles.itmContainer}>
          {StorageData.all?.map((item: StorageItemProps) => {
            return (
              <TouchableOpacity
                key={item.myPocketId || item.caseId}
                onPress={() =>
                  navigation.navigate(Route.navFileViewer, { data: item })
                }
                activeOpacity={0.6}
                style={styles.itmStorage}
              >
                {getUrlExtension(item.url) === 'pdf' ? (
                  <View style={styles.innerItmStorage}>
                    <PdfIcon height={50} width={50} />
                  </View>
                ) : (
                  <Image source={{ uri: item.url }} style={styles.itmImage} />
                )}
                <Text numberOfLines={1} style={styles.txtItmName}>
                  {item.fileName}
                </Text>
                {activeCheckBox && (
                  <CheckBox
                    checked={
                      activeItem?.myPocketId === item.myPocketId ||
                      activeItem?.caseId === item.caseId
                    }
                    containerStyle={styles.checkBoxCont}
                    checkedIcon={<CheckIcon color={theme.colors.primary} />}
                    uncheckedIcon={
                      <MaterialCommunityIcons
                        name="checkbox-blank-outline"
                        size={20}
                        color={theme.colors.black}
                      />
                    }
                    onPress={() => onPressCheckBox(item)}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Storage;

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors?.background,
    flex: 1,
  },
  txtAvailableDoc: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.m,
    marginLeft: theme.spacing.m,
    marginVertical: theme.spacing.m - 6,
    fontWeight: '600',
  },

  itmStorage: {
    alignItems: 'flex-start',
    margin: theme.spacing.s,
  },
  innerItmStorage: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itmImage: {
    height: 98,
    width: 98,
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: theme.borderRadii.m,
  },
  itmContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.m - 6,
  },
  scrollCont: {
    flexGrow: 1,
  },
  txtItmName: {
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.s - 3,
    width: 100,
  },
  iconCheckCont: {
    position: 'absolute',
    bottom: 30,
    right: 10,
  },
  checkBoxCont: {
    position: 'absolute',
    right: -15,
    top: -10,
  },
}));
