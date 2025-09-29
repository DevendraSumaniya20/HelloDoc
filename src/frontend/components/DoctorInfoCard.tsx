import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Doctor } from '../types/types';
import { moderateScale } from '../constants/responsive';
import Colors from '../constants/color';
import timeAgo from '../utils/timeHelper';

interface DoctorInfoCardProps {
  doctor: Doctor;
  onViewProfile?: () => void;
}

const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({
  doctor,
  onViewProfile,
}) => {
  // 1️⃣ Tick state to trigger re-render every minute
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000); // every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // 2️⃣ Compute status text
  const getStatusText = () => {
    if (doctor.status === 'online') return 'Online';
    if (doctor.status === 'busy') return 'Busy';
    return doctor.lastSeen ? timeAgo(doctor.lastSeen) : 'Last seen recently';
  };

  // 3️⃣ Dot color based on status
  const statusDotStyle =
    doctor.status === 'online'
      ? styles.onlineStatus
      : doctor.status === 'busy'
      ? styles.busyStatus
      : styles.offlineStatus;

  return (
    <View style={styles.doctorCard}>
      <View style={styles.cardContent}>
        <Text style={styles.specialty}>{doctor.specialty}</Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {doctor.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({doctor.reviews} reviews)</Text>
        </View>

        {/* 4️⃣ Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, statusDotStyle]} />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.viewProfileButton}
        onPress={onViewProfile}
      >
        <Text style={styles.viewProfileText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  doctorCard: {
    backgroundColor: Colors.white,
    marginHorizontal: moderateScale(16),
    marginVertical: moderateScale(12),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flex: 1,
  },
  specialty: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: moderateScale(4),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(4),
  },
  rating: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
    marginRight: moderateScale(8),
  },
  reviews: {
    fontSize: 12,
    color: Colors.grayDark,
  },
  viewProfileButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(6),
  },
  viewProfileText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(4),
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
    fontSize: 12,
    color: Colors.black,
  },
});

export default DoctorInfoCard;
