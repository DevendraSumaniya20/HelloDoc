// components/CategoryCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { HealthCategory } from '../types/types';
import HomeStyle from '../screens/Home/HomeStyle';

interface CategoryCardProps {
  category: HealthCategory;
  onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => (
  <TouchableOpacity style={HomeStyle.categoryCard} onPress={onPress}>
    <View style={[HomeStyle.categoryIcon, { backgroundColor: category.color }]}>
      <Text style={HomeStyle.categoryIconText}>{category.icon}</Text>
    </View>
    <Text style={HomeStyle.categoryName}>{category.name}</Text>
  </TouchableOpacity>
);

export default CategoryCard;
