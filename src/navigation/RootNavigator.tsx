import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HabitsListScreen, HabitDetailScreen, StatisticsScreen, SettingsScreen } from '../screens';

export type HabitsStackParamList = {
  HabitsList: undefined;
  HabitDetail: { habitId?: string } | undefined;
};

export type RootTabParamList = {
  HabitsTab: undefined;
  Statistics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const HabitsStack = createNativeStackNavigator<HabitsStackParamList>();

function HabitsStackNavigator() {
  return (
    <HabitsStack.Navigator>
      <HabitsStack.Screen
        name="HabitsList"
        component={HabitsListScreen}
        options={{ title: 'Hábitos' }}
      />
      <HabitsStack.Screen
        name="HabitDetail"
        component={HabitDetailScreen}
        options={{ title: 'Detalle' }}
      />
    </HabitsStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarAccessibilityLabel:
          route.name === 'HabitsTab' ? 'Pestaña Hábitos' : route.name === 'Statistics' ? 'Pestaña Estadísticas' : 'Pestaña Ajustes',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';

          if (route.name === 'HabitsTab') {
            iconName = 'checkbox-outline';
          } else if (route.name === 'Statistics') {
            iconName = 'bar-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HabitsTab"
        component={HabitsStackNavigator}
        options={{ title: 'Hábitos' }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: 'Estadísticas' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ajustes' }}
      />
    </Tab.Navigator>
  );
}
