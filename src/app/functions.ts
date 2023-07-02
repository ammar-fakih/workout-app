import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import Toast from 'react-native-root-toast';

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

function showToast(
  message: string,
  backgroundColor: string = '#000',
  duration = Toast.durations.LONG
) {
  Toast.show(message, {
    duration,
    opacity: 1,
    position: -100,
    backgroundColor,
    shadow: false,
  });
}

export { scale, verticalScale, moderateScale, showToast };
