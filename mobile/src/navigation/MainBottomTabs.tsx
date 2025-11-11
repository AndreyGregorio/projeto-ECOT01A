import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { HomeTopTabs } from '@/navigation/HomeTopTabs';

// ... (seus placeholders de tela)
const GroupsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Grupos</Text>
  </View>
);
// ... (outros placeholders)
const CreateScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Criar Post</Text>
  </View>
);
const NotificationsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Notificações</Text>
  </View>
);
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Perfil</Text>
  </View>
);

const BottomTab = createBottomTabNavigator();

export function MainBottomTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        // ... (outras screenOptions)
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#828282',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
        },

        tabBarIcon: ({ color, size, focused }) => {
          // --- A CORREÇÃO ESTÁ AQUI ---
          // Dê um ícone de fallback (ex: 'circle') como valor inicial.
          let iconName: React.ComponentProps<typeof Feather>['name'] = 'circle';

          if (route.name === 'HomeTabs') {
            iconName = 'home';
          } else if (route.name === 'Groups') {
            iconName = 'users';
          } else if (route.name === 'Create') {
            iconName = 'plus-square';
          } else if (route.name === 'Notifications') {
            iconName = 'bell';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          // ... (sua lógica de imagem de perfil)

          // Agora o TypeScript tem certeza que 'iconName' nunca será undefined.
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <BottomTab.Screen name="HomeTabs" component={HomeTopTabs} />
      <BottomTab.Screen name="Groups" component={GroupsScreen} />
      <BottomTab.Screen name="Create" component={CreateScreen} />
      <BottomTab.Screen name="Notifications" component={NotificationsScreen} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} />
    </BottomTab.Navigator>
  );
}