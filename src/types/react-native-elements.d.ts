// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FullTheme } from 'react-native-elements';

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

declare module 'react-native-elements/dist/config/colors' {
  export interface Colors {
    primary: string;
    primaryLight: string;
    primeGradient: string[];
    backgroundGradient: string[];
    bgcFirstGradientColor: string;
    bgcSecondGradientColor: string;
    primaryLightest: string;
    yellowStar: string;
    black: string;
    white: string;
    grey: string;
    borderButtonColor: string;
    background: string;
    iconColor: string;
    lightgrey: string;
    textInBgColor: string;
    textPrimary: string;
    textSecondary: string;
    buttonText: string;
    lightestGrey: string;
    blueText: string;
    lightBlack: string;
    tabBgColor: string;
    blackTrans: string;
    orangeLight: string;
    pinkDark: string;
    orange1: string;
    greenLight: string;
    black1: string;
    black2: string;
    white1: string;
    whiteDull: string;
    dividerColor: string;
    headerBottomLineColor: string;
    bottomSafeAreaViewColor: string;
    progressBarBgColor: string;
    gradientPrime: string;
    gradientSecond: string;
    shadowColor: string;
    transparent: string;
    modalHandleColor: string;
    loaderColor: string;
    notificationBackColor: string;
    subscribedColor: string;
    royalBlue: string;
    blackColor: string;
    refreshLoaderColor: string;
  }
}

declare module 'react-native-elements' {
  export interface Sizing {
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  }

  export interface FontFamily {
    light: string;
    regular: string;
    medium: string;
    semiBold: string;
    bold: string;
    extraBold: string;
  }

  export interface FullTheme {
    spacing: Sizing;
    borderRadii: Sizing;
    fontSize: Sizing;
    fontFamily: FontFamily;
  }
}
