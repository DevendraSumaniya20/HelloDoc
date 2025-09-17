import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import screens from '../screens';
import navigationStrings from '../constants/navigationString';
import Colors from '../constants/color';
import { MainStackParamList } from '../types/types';
import Icons from '../constants/svgPath';
import { moderateScale } from '../constants/responsive';

const Tab = createBottomTabNavigator<MainStackParamList>();

const TabNavigation: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.info,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: () => {
          switch (route.name) {
            case navigationStrings.Home:
              return (
                <Icons.Home
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />
              );
            case navigationStrings.Chat:
              return (
                <Icons.Chat
                  height={moderateScale(20)}
                  width={moderateScale(20)}
                />
              );
            case navigationStrings.Setting:
              return (
                <Icons.Setting
                  height={moderateScale(30)}
                  width={moderateScale(30)}
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
        },
      })}
    >
      <Tab.Screen name={navigationStrings.Home} component={screens.Home} />
      <Tab.Screen name={navigationStrings.Chat} component={screens.Chat} />
      <Tab.Screen
        name={navigationStrings.Setting}
        component={screens.Setting}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
