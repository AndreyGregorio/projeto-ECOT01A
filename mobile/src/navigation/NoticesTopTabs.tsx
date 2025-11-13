import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- 1. IMPORTE AQUI
import AllBoardsScreen from '@/screens/AllBoardsScreen';
import MyNoticesScreen from '@/screens/MyNoticesScreen';

const Tab = createMaterialTopTabNavigator();

export function NoticesTopTabs() {
  return (
    // 2. ENVOLVA O NAVEGADOR COM A SAFEARIAVIEW
    // Damos um flex: 1 e uma cor de fundo para evitar "pulos"
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}> 
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold', textTransform: 'none' },
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#888',
        }}
      >
        <Tab.Screen 
          name="MyNotices" 
          component={MyNoticesScreen} 
          options={{ title: 'Meus Avisos' }} 
        />
        <Tab.Screen 
          name="AllBoards" 
          component={AllBoardsScreen} 
          options={{ title: 'Quadros' }} 
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}