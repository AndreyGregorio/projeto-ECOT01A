import React from 'react';
// 1. IMPORTE O TIPO CORRETO
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps, // <--- ESTE É O CARA
} from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants'; // Agora vai funcionar

import  FeedScreen  from '@/screens/HomeScreen';

const SchedulesScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Tela de Horários</Text>
  </View>
);

const TopTab = createMaterialTopTabNavigator();

// 2. CORRIJA A ASSINATURA E O USO DAS PROPS
const CustomTopTabBar = (props: MaterialTopTabBarProps) => { // <--- RECEBA 'props'
  // 3. USE 'props.state' e 'props.navigation'
  const { state, navigation } = props;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTabs}>
        {state.routes.map((route, index) => { // <--- use state.routes
          const isActive = state.index === index; // <--- use state.index
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)} // <--- use navigation.
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
      // 4. PASSE 'props' DIRETAMENTE
      tabBar={(props) => <CustomTopTabBar {...props} />}
      style={{ paddingTop: Constants.statusBarHeight }}
    >
      <TopTab.Screen name="Horários" component={SchedulesScreen} />
      <TopTab.Screen name="Para você" component={FeedScreen} />
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