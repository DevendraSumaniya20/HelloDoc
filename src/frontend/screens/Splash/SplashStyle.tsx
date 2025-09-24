import { StyleSheet } from 'react-native';
import { moderateScale } from '../../constants/responsive';
import Colors from '../../constants/color';

const SplashStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.black,
    fontSize: moderateScale(32),
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.black,
    fontSize: moderateScale(16),
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: moderateScale(8),
    textAlign: 'center',
  },
  loader: {
    marginTop: moderateScale(20),
  },
});

export default SplashStyle;
