// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import styles from "../components/style"; // Você mudou o caminho, verifique se está correto
import {
  Alert,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  // <<< CORREÇÃO: Faltava importar estes componentes
  Text,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { Button, SocialIcon } from "react-native-elements";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from '@/contexts/AuthContext'; 

type LoginScreenProps = {
  navigation: StackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onLoginPress = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha email e senha.');
      return;
    }
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      // O AppNavigator cuida da navegação
    }
  };

  const onGoogleLoginPress = async () => {
    Alert.alert('Google Login', 'Funcionalidade a ser implementada.');
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>SeuApp</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#c4c3cb"
              style={styles.loginFormTextInput}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#c4c3cb"
              style={styles.loginFormTextInput}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />

            {isLoading ? (
              <ActivityIndicator size="large" color="#3897f1" style={{ marginTop: 10 }} />
            ) : (
              <Button
                buttonStyle={styles.loginButton}
                onPress={onLoginPress}
                title="Login"
              />
            )}

            <SocialIcon
              title="Login com Google"
              button
              type="google"
              style={{ marginTop: 10 }}
              onPress={onGoogleLoginPress}
            />

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.navButtonText}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.navButtonText}>
                Não tem conta? Crie uma
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}