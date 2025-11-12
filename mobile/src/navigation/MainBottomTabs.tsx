import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { HomeTopTabs } from '@/navigation/HomeTopTabs';

// 👇 MUDANÇA 1: Importar a tela de Perfil REAL
// (confirme se o caminho '@/screens/ProfileScreen' está certo)
import ProfileScreen from '@/screens/ProfileScreen'; 

// --- Placeholders (Deixe-os por enquanto) ---
const GroupsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Grupos</Text>
  </View>
);
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

// ❌ MUDANÇA 2: REMOVER o placeholder de ProfileScreen daqui
//
// const ProfileScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>Perfil</Text>
//   </View>
// );
//
// ----------------------------------------------------

const BottomTab = createBottomTabNavigator();

export function MainBottomTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
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
          
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <BottomTab.Screen 
        name="HomeTabs" 
        component={HomeTopTabs} 
        options={{ title: 'Feed' }} // Adicionei um 'title' para clareza
      />
      <BottomTab.Screen 
        name="Groups" 
        component={GroupsScreen} 
      />
      <BottomTab.Screen 
        name="Create" 
        component={CreateScreen} 
        options={{ title: 'Criar Publicação' }}
      />
      <BottomTab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ title: 'Notificações' }}
      />
      {/* Tudo certo aqui! 
        Como 'ProfileScreen' agora é o componente importado, 
        ele vai funcionar. 
      */}
      <BottomTab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Meu Perfil' }}
      />
    </BottomTab.Navigator>
  );
}