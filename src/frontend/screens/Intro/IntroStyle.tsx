// IntroStyle.ts
import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from '../../constants/responsive';

const { width } = Dimensions.get('window');

const IntroStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateScale(15),
    zIndex: 3,
    marginHorizontal: moderateScale(20),
    gap: moderateScale(8),
  },
  paginationInner: {
    height: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(16),
    zIndex: 3,
  },
  backButton: {
    borderRadius: moderateScale(20),
    overflow: 'hidden',
  },
  backButtonText: {
    fontSize: moderateScale(14),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    borderRadius: moderateScale(22),
    overflow: 'hidden',
  },
  nextButtonText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#333',
  },
  getStartedButton: {
    borderRadius: moderateScale(22),
    overflow: 'hidden',
    padding: moderateScale(16),
  },
  getStartedButtonText: {
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    color: '#FFF',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(14),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(10),
    zIndex: 3,
  },
  skipButtonText: {
    fontSize: moderateScale(12),
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
});

export default IntroStyle;
