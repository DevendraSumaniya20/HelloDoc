// components/CategoryCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HealthCategory } from '../types/types';
import Colors from '../constants/color';
import { moderateScale, scale } from '../constants/responsive';

interface CategoryCardProps {
  category: HealthCategory;
  onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
      <Text style={styles.categoryIconText}>{category.icon}</Text>
    </View>
    <Text style={styles.categoryName}>{category.name}</Text>
  </TouchableOpacity>
);

export default CategoryCard;

const styles = StyleSheet.create({
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
