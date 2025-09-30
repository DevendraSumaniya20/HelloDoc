import { StyleSheet } from 'react-native';
import Colors from '../../constants/color';
import { moderateScale, scale } from '../../constants/responsive';

const SearchStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayUltraLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    gap: 12,
  },
  backButton: {
    padding: moderateScale(8),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grayMedium,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: scale(14),
    padding: 0,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingTop: moderateScale(24),
  },
  resultsHeader: {
    paddingHorizontal: moderateScale(28),
    marginBottom: moderateScale(16),
  },
  resultsText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Colors.grayDark,
  },
  listContent: {
    paddingHorizontal: moderateScale(24),
    paddingBottom: moderateScale(24),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateScale(40),
  },
  emptyIcon: {
    fontSize: scale(64),
    marginBottom: moderateScale(16),
  },
  emptyTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: Colors.grayDark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: scale(14),
    color: Colors.neutral,
    textAlign: 'center',
  },
});

export default SearchStyle;
