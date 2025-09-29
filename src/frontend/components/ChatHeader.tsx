import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
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
  onInfo?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  doctor,
  onBack,
  onCall,
  onVideoCall,
  onInfo,
}) => {
  // 1️⃣ State to trigger re-render every minute
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000); // 60 seconds
    return () => clearInterval(interval);
  }, []);

  // 2️⃣ Compute status text
  const getStatusText = () => {
    if (doctor.status === 'online') return 'Online';
    if (doctor.status === 'busy') return 'Busy';
    return doctor.lastSeen ? timeAgo(doctor.lastSeen) : 'Last seen recently';
  };

  // 3️⃣ Status dot color
  const statusDotStyle =
    doctor.status === 'online'
      ? styles.onlineStatus
      : doctor.status === 'busy'
      ? styles.busyStatus
      : styles.offlineStatus;

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

        <View style={styles.doctorInfo}>
          <Image source={{ uri: doctor.image }} style={styles.headerAvatar} />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <View style={styles.doctorStatus}>
              <View style={[styles.statusDot, statusDotStyle]} />
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
        </View>

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
          {onInfo && (
            <TouchableOpacity style={styles.actionButton} onPress={onInfo}>
              <Icons.Dots
                height={moderateScale(16)}
                width={moderateScale(16)}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
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
  backIcon: {
    padding: moderateScale(8),
    marginRight: moderateScale(8),
  },
  doctorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.black,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: scale(12),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: moderateScale(2),
  },
  doctorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(6),
  },
  onlineStatus: {
    backgroundColor: '#10B981',
  },
  busyStatus: {
    backgroundColor: '#F59E0B',
  },
  offlineStatus: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    fontSize: scale(10),
    color: Colors.black,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: moderateScale(8),
    marginLeft: moderateScale(4),
  },
});

export default ChatHeader;
