import { StyleSheet } from 'react-native';
import Colors from '../../constants/color';
import { moderateScale } from '../../constants/responsive';

const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  backIcon: {
    fontSize: 24,
    color: Colors.black,
  },
  headerTextContainer: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: moderateScale(40),
  },
  profileSection: {
    backgroundColor: Colors.white,
    paddingVertical: moderateScale(30),
    alignItems: 'center',
    marginBottom: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: moderateScale(16),
  },
  profileImage: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: Colors.grayLight,
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  editIcon: {
    position: 'absolute',
    bottom: moderateScale(5),
    right: moderateScale(5),
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(20),
    padding: moderateScale(8),
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  editIconText: {
    fontSize: 16,
  },
  displayNameText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: moderateScale(4),
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    color: Colors.grayDark,
  },
  formCard: {
    backgroundColor: Colors.white,
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: moderateScale(16),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  resetButton: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    backgroundColor: '#FEF2F2', // Light Red background
    borderWidth: 1,
    borderColor: '#FCA5A5', // Soft Red border
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#DC2626', // Darker Red text
    fontWeight: '600',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },

  // Button Container
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },

  // Save Button
  saveButton: {
    backgroundColor: Colors.primary || '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary || '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },

  // Secondary Button
  secondaryButton: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary || '#2563EB',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary || '#2563EB',
    letterSpacing: 0.5,
  },

  // Danger Button
  dangerButton: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
});

export default ProfileStyle;
