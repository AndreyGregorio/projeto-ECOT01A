import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// 1. Hook de autenticação (sem mudança)
import { useAuth } from '@/contexts/AuthContext';

// 2. Imports das telas de Auth (sem mudança)
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';

// 3. --- MUDANÇA AQUI ---
// Importe o NOVO navegador de abas principal
import { MainBottomTabs } from '@/screens/MainBottomTabs'; 
// Remova o import da antiga 'HomeScreen'

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
    <Stack.Navigator>
      <Stack.Screen
        // Dê um nome genérico, pois ele contém TODAS as abas
        name="Main" 
        component={MainBottomTabs} // Carregue o navegador de ABAS
        options={{ headerShown: false }} // Esconda o header do Stack
      />
      {/* Aqui você pode adicionar telas que ficam "por cima" das abas.
        Por exemplo, uma tela de "Configurações" ou "Chat"
      */}
      {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
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