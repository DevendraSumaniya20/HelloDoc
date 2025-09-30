// TabNavigation.tsx (Revised)

import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import screens from '../screens';
import navigationStrings from '../constants/navigationString';
import Colors from '../constants/color';
// Import the correct TabStackParamList
import { TabStackParamList } from '../types/types';
import Icons from '../constants/svgPath';
import { moderateScale } from '../constants/responsive';

// Use the dedicated TabStackParamList
const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigation: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.info,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color }) => {
          switch (route.name) {
            case navigationStrings.Home:
              return (
                <Icons.Home
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                  fill={color}
                />
              );
            case navigationStrings.Chat:
              return (
                <Icons.Chat
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                  fill={color}
                />
              );
            case navigationStrings.Setting:
              return (
                <Icons.Setting
                  height={moderateScale(30)}
                  width={moderateScale(30)}
                  fill={color}
                />
              );

            case navigationStrings.Search:
              return (
                <Icons.Search
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                  fill={Colors.white}
                />
              );
            default:
              return null;
          }
        },
        tabBarStyle: {
          height: moderateScale(70),
          paddingBottom: moderateScale(8),
          alignItems: 'center',
          // Use the stylesheet for better separation
          ...styles.tabBar,
        },
        tabBarLabelStyle: {
          fontSize: moderateScale(12),
          fontWeight: 'bold',
        },
      })}
    >
      {/* These screen names now correctly match the keys in TabStackParamList */}
      <Tab.Screen name={navigationStrings.Home} component={screens.Home} />
      <Tab.Screen name={navigationStrings.Search} component={screens.Search} />
      <Tab.Screen name={navigationStrings.Chat} component={screens.Chat} />
      <Tab.Screen
        name={navigationStrings.Setting}
        component={screens.Setting}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    backgroundColor: Colors.white,
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
  },
});
