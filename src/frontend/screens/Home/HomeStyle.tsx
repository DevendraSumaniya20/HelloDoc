import { Platform, StyleSheet } from 'react-native';
import Colors from '../../constants/color';
import { moderateScale, scale } from '../../constants/responsive';

const HomeStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(20),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  greeting: {
    color: Colors.black,
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  subGreeting: {
    color: Colors.grayDark,
    fontSize: scale(12),
    marginTop: moderateScale(4),
  },
  profileButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    backgroundColor: Colors.grayDark,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayMedium,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    paddingVertical:
      Platform.OS === 'ios' ? moderateScale(8) : moderateScale(6),
    gap: 5,
    marginTop: moderateScale(10),
  },
  searchIcon: {
    fontSize: scale(16),
    marginRight: moderateScale(8),
    color: Colors.white,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: scale(14),
  },
  content: {
    backgroundColor: Colors.neutral,
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    paddingTop: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    minHeight: '100%',
  },
  aiDoctorBanner: {
    backgroundColor: Colors.accent,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    color: Colors.white,
    fontSize: scale(16),
    fontWeight: 'bold',
    marginBottom: moderateScale(4),
  },
  bannerSubtitle: {
    color: Colors.neutral,
    fontSize: scale(12),
  },
  bannerIcon: {
    width: moderateScale(60),
    height: moderateScale(60),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIconText: {
    fontSize: scale(30),
    color: Colors.white,
  },
  section: {
    marginBottom: moderateScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  sectionTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  viewAllText: {
    color: Colors.accent,
    fontSize: scale(14),
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  searchPlaceholder: {
    flex: 1,
    color: Colors.neutral,
    fontSize: scale(14),
  },
});

export default HomeStyle;
