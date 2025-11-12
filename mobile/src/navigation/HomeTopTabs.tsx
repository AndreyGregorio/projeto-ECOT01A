import React from 'react';
// 1. IMPORTE O TIPO CORRETO
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps, 
} from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants'; 

import  FeedScreen  from '@/screens/HomeScreen'; // Esta é a sua tela "Para você"

// <-- MUDANÇA 1: Renomear o placeholder (e o texto)
const CalendarScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Tela de Calendário</Text>
  </View>
);

const TopTab = createMaterialTopTabNavigator();

// O 'CustomTopTabBar' não precisa de nenhuma mudança,
// ele já lê as rotas dinamicamente
const CustomTopTabBar = (props: MaterialTopTabBarProps) => { 
  const { state, navigation } = props;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTabs}>
        {state.routes.map((route, index) => { 
          const isActive = state.index === index; 
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabButton}
            >
              <Text
                style={[
                  styles.headerTab,
                  isActive && styles.headerTabActive,
                ]}
              >
                {route.name}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity>
          <Feather name="mail" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export function HomeTopTabs() {
  return (
    <TopTab.Navigator
      tabBar={(props) => <CustomTopTabBar {...props} />}
      style={{ paddingTop: Constants.statusBarHeight }}
    >
      {/* <-- MUDANÇA 2: Invertemos a ordem. "Para você" vem primeiro. */}
      <TopTab.Screen name="Para você" component={FeedScreen} />
      
      {/* <-- MUDANÇA 3: Renomeamos "Horários" para "Calendario" */}
      <TopTab.Screen name="Calendario" component={CalendarScreen} />
    </TopTab.Navigator>
  );
}

// ... (seus estilos permanecem os mesmos)
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  headerTabs: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    transform: [{ translateX: -32 }],
  },
  tabButton: {
    paddingBottom: 10,
    position: 'relative',
  },
  headerTab: {
    fontWeight: '600',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.4)',
  },
  headerTabActive: {
    color: '#000000',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    width: 24,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
});