import { StyleSheet } from 'react-native';
import Colors from '../../constants/color';
import { moderateScale, scale } from '../../constants/responsive';

// -------------------- Styles --------------------
const ChatStyle = StyleSheet.create({
  container: { flex: 1 },
  chatContainer: { flex: 1 },
  messagesContainer: {
    flexGrow: 1,
    paddingVertical: moderateScale(16),
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    backgroundColor: Colors.primary,
  },
  cancelText: {
    color: Colors.white,
    fontSize: scale(16),
    fontWeight: '500',
  },
  selectionCount: {
    color: Colors.white,
    fontSize: scale(16),
    fontWeight: '600',
  },
  selectionActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: moderateScale(12),
  },
  actionText: {
    color: Colors.white,
    fontSize: scale(16),
    fontWeight: '500',
  },
  deleteText: {
    color: '#ffcccb',
  },
  searchModal: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: moderateScale(80),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingHorizontal: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.grayDark,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    marginBottom: moderateScale(16),
    fontSize: scale(14),
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  modalTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Colors.black,
  },
  closeButtonContainer: {
    padding: moderateScale(4),
  },
  closeButton: {
    fontSize: scale(32),
    fontWeight: '300',
    color: Colors.grayDark,
    lineHeight: 32,
  },
  searchResultsContainer: {
    paddingBottom: moderateScale(16),
  },
  emptySearchContainer: {
    paddingVertical: moderateScale(40),
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: scale(15),
    color: Colors.grayDark,
  },
  searchNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginHorizontal: moderateScale(4),
  },
  navButton: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    backgroundColor: Colors.primary,
    borderRadius: moderateScale(8),
  },
  navButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.5,
  },
  navButtonText: {
    color: Colors.white,
    fontSize: scale(14),
    fontWeight: '600',
  },
  matchCount: {
    fontSize: scale(14),
    color: Colors.black,
    fontWeight: '500',
  },
});

export default ChatStyle;
