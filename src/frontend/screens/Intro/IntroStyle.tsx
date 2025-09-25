// IntroStyle.ts
import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from '../../constants/responsive'; // Utility for responsive scaling
import Colors from '../../constants/color'; // App color palette

// Get device width & height for layout adjustments
const { width, height } = Dimensions.get('window');

const IntroStyle = StyleSheet.create({
  // Root container
  container: {
    flex: 1,
  },

  // Gradient overlay covering full screen
  gradient: {
    flex: 1,
  },

  // Wrapper for all slide content
  content: {
    flex: 1,
    zIndex: 2,
    position: 'relative',
  },

  // Individual slide container
  slide: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(60),
    paddingBottom: moderateScale(200),
  },

  // Inner slide content
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'red',
  },

  // Section for icons
  iconSection: {
    alignItems: 'center',
    marginBottom: moderateScale(40),
  },

  // Section for title + description
  textSection: {
    alignItems: 'center',
    marginBottom: moderateScale(30),
    paddingHorizontal: moderateScale(10),
  },

  // Section holding feature cards
  featuresSection: {
    width: '100%',
    maxWidth: moderateScale(320),
  },

  // Pagination + arrows container (full row)
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // arrows on sides, dots centered
    position: 'absolute',
    bottom: moderateScale(100),
    left: moderateScale(20),
    right: moderateScale(20),
    zIndex: 3,
  },

  // Pagination dots row (center part)
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(8),
  },

  // Single pagination dot
  paginationInner: {
    borderRadius: moderateScale(8),
  },

  arrowButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: moderateScale(28),
    width: moderateScale(56),
    height: moderateScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },

  // Navigation buttons container
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(40),
    zIndex: 3,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  // Back button
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: moderateScale(28),
    width: moderateScale(56),
    height: moderateScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },

  backButtonText: {
    fontSize: moderateScale(14),
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Spacer
  spacer: {
    flex: 1,
  },

  // Next button
  nextButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: moderateScale(28),
    width: moderateScale(56),
    height: moderateScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },

  nextButtonText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // "Get Started" button
  getStartedButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: moderateScale(28),
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    minWidth: moderateScale(160),
  },

  getStartedButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // "Skip" button
  skipButton: {
    alignSelf: 'center',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(18),
    marginBottom: moderateScale(15),
    zIndex: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'absolute',
    bottom: moderateScale(0),
    left: moderateScale(20),
    right: moderateScale(20),
  },

  skipButtonText: {
    fontSize: moderateScale(14),
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Title/Description section
  titleContainer: {
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },

  subtitleBadge: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: moderateScale(12),
  },

  title: {
    fontSize: moderateScale(32),
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: moderateScale(38),
    marginBottom: moderateScale(8),
  },

  description: {
    fontSize: moderateScale(16),
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: moderateScale(24),
    paddingHorizontal: moderateScale(5),
  },
});

export default IntroStyle;
