import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

interface LoginScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      const errorMessage = error.message || 'Erro de conexão. Tente novamente.';
      Alert.alert('Falha no Login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    console.log('Navegando para a tela de Registro...');
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>UNIFEED</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Entre</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="email@dominio.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Continuar'}
          </Text>
        </TouchableOpacity>

        {/* Registrar */}
        <TouchableOpacity onPress={handleRegister} disabled={loading}>
          <Text style={styles.registerText}>Registrar</Text>
        </TouchableOpacity>

        {/* Terms and Privacy */}
        <Text style={styles.termsText}>
          Ao clicar em continuar, você concorda com os nossos{' '}
          <Text style={styles.linkText}>Termos de Serviço</Text> e com a{' '}
          <Text style={styles.linkText}>Política de Privacidade</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 80,
  },
  subtitle: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#000000',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 20,
  },
  linkText: {
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default LoginScreen;
