import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Doctor } from '../types/types';
import { moderateScale } from '../constants/responsive';
import Colors from '../constants/color';

interface DoctorInfoCardProps {
  doctor: Doctor;
  onViewProfile?: () => void;
}

const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({
  doctor,
  onViewProfile,
}) => {
  return (
    <View style={styles.doctorCard}>
      <View style={styles.cardContent}>
        <Text style={styles.specialty}>{doctor.specialty}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {doctor.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({doctor.reviews} reviews)</Text>
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
});

export default DoctorInfoCard;
