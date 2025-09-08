import { Platform, StyleSheet } from 'react-native';
import Colors from '../../constants/color';
import { moderateScale, scale } from '../../constants/responsive';

const HomeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
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
    color: Colors.white,
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  subGreeting: {
    color: Colors.grayMedium,
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
    backgroundColor: Colors.secondary,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    paddingVertical: Platform.OS === 'ios' ? moderateScale(8) : 0,
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
  doctorCard: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  doctorImageContainer: {
    position: 'relative',
    marginRight: moderateScale(16),
  },
  doctorImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(30),
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: moderateScale(2),
    right: moderateScale(2),
    width: moderateScale(16),
    height: moderateScale(16),
    backgroundColor: Colors.success,
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(2),
    borderColor: Colors.white,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: moderateScale(4),
  },
  doctorSpecialty: {
    fontSize: scale(12),
    color: Colors.grayMedium,
    marginBottom: moderateScale(4),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: scale(14),
    color: Colors.textSecondary,
    marginRight: moderateScale(8),
  },
  reviewText: {
    fontSize: scale(12),
    color: Colors.textSecondary,
  },
  consultButton: {
    backgroundColor: Colors.accent,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
  },
  consultButtonText: {
    color: Colors.white,
    fontSize: scale(14),
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    alignItems: 'center',
    marginBottom: moderateScale(12),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  categoryIcon: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(12),
    backgroundColor: Colors.secondary,
  },
  categoryIconText: {
    fontSize: scale(24),
    color: Colors.white,
  },
  categoryName: {
    fontSize: scale(12),
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});

export default HomeStyle;
