// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 1. Importe nosso Provedor de Autenticação
import { AuthProvider } from './src/contexts/AuthContext';

// 2. Importe o Navegador
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* 3. O AuthProvider deve ser o "pai" de tudo,
           para que o AppNavigator (e todas as telas)
           possam saber se o usuário está logado.
      */}
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}