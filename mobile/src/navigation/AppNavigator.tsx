import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// 1. Hook de autenticação (sem mudança)
import { useAuth } from '@/contexts/AuthContext';

// 2. Imports das telas de Auth (sem mudança)
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';

// 3. Imports das Telas do App (Logado)
import { MainBottomTabs } from '@/navigation/MainBottomTabs'; 
import SettingsScreen from '@/screens/SettingsScreen';

// <-- MUDANÇA 1: Importar a nova tela de Edição
import EditProfileScreen from '@/screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

// 4. AuthStack (sem mudança)
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// 5. --- MUDANÇA AQUI ---
function AppStack() {
  // Telas para quem ESTÁ logado
  return (
    // É mais limpo definir o 'headerShown: false' aqui
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        // Contém todas as suas abas (Home, Perfil, etc.)
        name="Main" 
        component={MainBottomTabs}
      />
      
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
      />

      {/* <-- MUDANÇA 2: Adicionar a tela de Edição de Perfil */}
      {/* O SettingsScreen vai navegar para esta tela */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
      />

    </Stack.Navigator>
  );
}

// 6. O restante (sem mudança, já estava perfeito)
export default function AppNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}