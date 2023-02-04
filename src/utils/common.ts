import Share from 'react-native-share';
import { qrImage } from 'src/helper/image/Base64';
import { PracticeArea } from 'src/types/user.types';
import { UserType } from 'src/constants/constants';
import Config from 'react-native-config';

const FirstCharText = (text: string) => {
  var matches = text?.match(/\b(\w)/g);
  return matches?.join('');
};
const onShare = async (val: string) => {
  const options = {
    title: 'App link',
    message: `https://${Config.REDIRECT_URL}/viewing-profile/${val}`,
    url: qrImage,
  };
  try {
    await Share.open(options);
  } catch (error) {
    // showMessage(error.message);
  }
};

const getUrlExtension = (url: string) => {
  return url?.split(/[#?]/)[0].split('.').pop().trim();
};

function getFilename(url: string) {
  if (url) {
    var m = url.toString().match(/(?:\.([^.]+))?$/);

    if (m && m.length > 1) {
      return m[1];
    }
  }
  return '';
}

const secsToTime = (sec: number) => {
  let sign = sec < 0 ? '-' : '';
  sec = Math.abs(sec);
  let z = (n: number) => (n < 10 ? '0' : '') + n;
  return (
    sign +
    z((sec / 3600) | 0) +
    ':' +
    z(((sec % 3600) / 60) | 0) +
    ':' +
    z(sec % 60)
  );
};

const getProvider = (provider: string) => {
  if (provider === 'facebook.com') {
    return 1;
  } else if (provider === 'apple.com') {
    return 2;
  } else if (provider === 'linkedin') {
    return 3;
  }
  return 1;
};

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

const userIsAttorney = (userType: number) => {
  return (
    userType === UserType.ATTORNEY ||
    userType === UserType.LAW_FIRM ||
    userType === UserType.LEGAL_SERVICE_PROVIDER
  );
};

const createArrayUseNumber = (length: number) => {
  return Array(length).fill(0);
};

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

const niceBytes = (x: string) => {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
};

export {
  FirstCharText,
  onShare,
  getUrlExtension,
  secsToTime,
  getProvider,
  getFilename,
  createArrayUseNumber,
  getPracticeArea,
  userIsAttorney,
  niceBytes,
};
