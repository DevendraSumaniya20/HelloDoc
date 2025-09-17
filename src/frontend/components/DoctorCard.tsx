// components/DoctorCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import { Doctor } from '../types/types';
import Colors from '../constants/color';
import { moderateScale, scale } from '../constants/responsive';

interface DoctorCardProps {
  doctor: Doctor;
  onConsult?: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onConsult }) => (
  <TouchableOpacity style={styles.doctorCard} onPress={onConsult}>
    <View style={styles.doctorImageContainer}>
      <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
      {doctor.isOnline && <View style={styles.onlineIndicator} />}
    </View>
    <View style={styles.doctorInfo}>
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>⭐ {doctor.rating}</Text>
        <Text style={styles.reviewText}>({doctor.reviews} reviews)</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.consultButton} onPress={onConsult}>
      <Text style={styles.consultButtonText}>Consult</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

export default DoctorCard;

const styles = StyleSheet.create({
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
});
