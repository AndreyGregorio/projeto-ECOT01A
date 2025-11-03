import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// 1. Importe o nosso hook de autenticação
import { useAuth } from '@/contexts/AuthContext';

// 2. Importe TODAS as novas telas
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';
import { HomeScreen } from '@/screens/HomeScreen';

const Stack = createNativeStackNavigator();

// 3. Stacks (conjuntos de telas) separadas
function AuthStack() {
  // Telas para quem NÃO está logado
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  // Telas para quem ESTÁ logado
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Meu App' }}
      />
      {/* Outras telas do app viriam aqui, ex: Perfil, Configurações */}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  // 4. Pegamos o estado do nosso contexto
  const { token, isLoading } = useAuth();

  // 5. Se estivermos carregando o token, mostre um spinner
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 6. O Roteador principal
  return (
    <NavigationContainer>
      {/* Aqui está a mágica:
        Se 'token' existir, mostre o AppStack (logado).
        Se 'token' for nulo, mostre o AuthStack (deslogado).
      */}
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}