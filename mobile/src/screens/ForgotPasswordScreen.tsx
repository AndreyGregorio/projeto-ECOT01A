// src/screens/ForgotPasswordScreen.tsx

import React, { useState } from 'react';
import styles from '../components/style'; // Reutilizando seus estilos
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  ActivityIndicator, // Para feedback de loading
} from 'react-native';
import { Button } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@/contexts/AuthContext'; // Importe o useAuth

type ForgotPasswordProps = {
  navigation: StackNavigationProp<any>;
};

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth(); // Pegue a nova função do contexto

  const handlePasswordRequest = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu email.');
      return;
    }

    setIsLoading(true);
    // Chama a função do contexto
    const success = await forgotPassword(email);
    setIsLoading(false);

    if (success) {
      // Se sucesso, avisa o usuário e o manda de volta para o Login
      Alert.alert(
        'Verifique seu Email',
        'Se uma conta com este email existir, um link de recuperação foi enviado.'
      );
      navigation.navigate('Login');
    }
    // Se falhar, o próprio AuthContext já vai mostrar um Alert de erro.
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            {/* Logo e Nome do App (reutilizado do RegisterScreen) */}
            <View style={styles.logoContainer}>
              <Image
                style={styles.logoImage}
                source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
              />
              <Text style={styles.appName}>Recuperar Senha</Text>
            </View>

            <Text style={{ textAlign: 'center', marginBottom: 20 }}>
              Digite seu email para enviarmos um link de recuperação.
            </Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#c4c3cb"
              style={styles.loginFormTextInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Mostra o loading no botão */}
            {isLoading ? (
              <ActivityIndicator size="large" color="#3897f1" style={{ marginTop: 10 }} />
            ) : (
              <Button
                buttonStyle={styles.loginButton}
                onPress={handlePasswordRequest}
                title="Enviar"
              />
            )}

            {/* Botão para navegar de volta ao Login */}
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.navButtonText}>Voltar para o Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}