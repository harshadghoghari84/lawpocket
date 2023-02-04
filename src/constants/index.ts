import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const HEIGHT = height;
export const WIDTH = width;
export const LARGE_BTN = width - 50;
export const SMALL_BTN = width / 2;

export const ASPECT_RATIO = width / 360;
