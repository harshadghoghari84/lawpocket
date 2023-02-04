import RNSInfo from 'react-native-sensitive-info';

// get value from secure store
const getSecureValue = async (key: string) => {
  let result;
  try {
    result = await RNSInfo.getItem(key, {
      sharedPreferencesName: 'lawPocket',
      keychainService: 'lawPocket',
    });
  } catch (e) {
    // crashlytics().recordError(e);
  }
  return result ?? null;
};

// save value in secure store
const setSecureValue = async (key: string, value: string) => {
  try {
    await RNSInfo.setItem(key, value, {
      sharedPreferencesName: 'lawPocket',
      keychainService: 'lawPocket',
    });
  } catch (e) {
    // crashlytics().recordError(e);
  }
};

// delete secure store value
const deleteSecureValue = async (key: string) => {
  try {
    await RNSInfo.deleteItem(key, {
      sharedPreferencesName: 'lawPocket',
      keychainService: 'lawPocket',
    });
  } catch (e) {
    // crashlytics().recordError(e);
  }
};

export { getSecureValue, setSecureValue, deleteSecureValue };
