import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';
import { Doctor } from '../types/types';
import Colors from '../constants/color';
import { moderateScale, scale } from '../constants/responsive';
import Icons from '../constants/svgPath';
import timeAgo from '../utils/timeHelper';

interface ChatHeaderProps {
  doctor: Doctor;
  onBack: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onProfilePress?: () => void;
  onSearch?: () => void;
  onClearChat?: () => void;
  onExport?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  doctor,
  onBack,
  onCall,
  onVideoCall,
  onProfilePress,
  onSearch,
  onClearChat,
  onExport,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const getStatusText = () => {
    if (doctor.status === 'online') return 'Online';
    if (doctor.status === 'busy') return 'Busy';
    return doctor.lastSeen ? timeAgo(doctor.lastSeen) : 'Last seen recently';
  };

  const statusDotStyle =
    doctor.status === 'online'
      ? styles.onlineStatus
      : doctor.status === 'busy'
      ? styles.busyStatus
      : styles.offlineStatus;

  const toggleMenu = () => setMenuVisible(prev => !prev);

  const handleOption = (option: 'search' | 'clear' | 'export') => {
    setMenuVisible(false);
    if (option === 'search' && onSearch) onSearch();
    if (option === 'clear' && onClearChat) onClearChat();
    if (option === 'export' && onExport) onExport();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={onBack}>
          <Icons.LeftArrow
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.doctorInfo}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <Image source={{ uri: doctor.image }} style={styles.headerAvatar} />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <View style={styles.doctorStatus}>
              <View style={[styles.statusDot, statusDotStyle]} />
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {onCall && (
            <TouchableOpacity style={styles.actionButton} onPress={onCall}>
              <Icons.Call
                height={moderateScale(20)}
                width={moderateScale(20)}
              />
            </TouchableOpacity>
          )}
          {onVideoCall && (
            <TouchableOpacity style={styles.actionButton} onPress={onVideoCall}>
              <Icons.Video
                height={moderateScale(20)}
                width={moderateScale(20)}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={toggleMenu}>
            <Icons.Dots height={moderateScale(20)} width={moderateScale(20)} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown menu modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            {onSearch && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleOption('search')}
              >
                <Icons.Search
                  height={moderateScale(18)}
                  width={moderateScale(18)}
                  fill={Colors.white}
                  style={styles.menuIconSvg}
                />
                <Text style={styles.menuText}>Search Messages</Text>
              </TouchableOpacity>
            )}

            {onExport && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleOption('export')}
              >
                <Icons.ExportIcon
                  height={moderateScale(18)}
                  width={moderateScale(18)}
                  fill={Colors.white}
                  style={styles.menuIconSvg}
                />
                <Text style={styles.menuText}>Export Chat</Text>
              </TouchableOpacity>
            )}

            {onClearChat && (
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemLast]}
                onPress={() => handleOption('clear')}
              >
                <Icons.DeleteIcon
                  height={moderateScale(18)}
                  width={moderateScale(18)}
                  fill={Colors.white}
                  style={styles.menuIconSvg}
                />
                <Text style={[styles.menuText, styles.dangerText]}>
                  Clear Chat
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backIcon: { padding: moderateScale(8), marginRight: moderateScale(8) },
  doctorInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.black,
  },
  doctorDetails: { flex: 1 },
  doctorName: {
    fontSize: scale(12),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: moderateScale(2),
  },
  doctorStatus: { flexDirection: 'row', alignItems: 'center' },
  statusDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(6),
  },
  onlineStatus: { backgroundColor: '#10B981' },
  busyStatus: { backgroundColor: '#F59E0B' },
  offlineStatus: { backgroundColor: '#6B7280' },
  statusText: { fontSize: scale(10), color: Colors.black },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { padding: moderateScale(8), marginLeft: moderateScale(4) },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: moderateScale(60),
    paddingRight: moderateScale(16),
  },
  menu: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(8),
    minWidth: moderateScale(200),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center', // ✅ vertical alignment
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grayLight,
  },

  menuIconSvg: {
    marginRight: moderateScale(12),
  },

  menuEmoji: {
    fontSize: scale(16), // ✅ matches SVG size
    marginRight: moderateScale(12),
    textAlignVertical: 'center',
  },

  menuText: {
    fontSize: scale(14),
    color: Colors.black,
    fontWeight: '500',
  },

  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: moderateScale(12),
  },

  dangerText: {
    color: '#EF4444',
  },
});

export default ChatHeader;
