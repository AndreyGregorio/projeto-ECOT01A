import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

// 1. Hook de autenticação 
import { useAuth } from '@/contexts/AuthContext';

// 2. Imports das telas de Auth 
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';

// 3. Imports das Telas do App (Logado)
import { MainBottomTabs } from '@/navigation/MainBottomTabs'; 
import SettingsScreen from '@/screens/SettingsScreen';
import EditProfileScreen from '@/screens/EditProfileScreen';
import CommentsScreen from '@/screens/CommentsScreen'; // <-- A importação já estava correta

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

      {/* <-- MUDANÇA 1: Removi os {} extras daqui --> */}

      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
      />

      {/* <-- MUDANÇA 2: Adicionada a tela de Comentários --> */}
      {/* Agora, quando o PostItem chamar 'navigation.navigate('Comments')',
          o app saberá para onde ir.
      */}
      <Stack.Screen 
        name="Comments" 
        component={CommentsScreen} 
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