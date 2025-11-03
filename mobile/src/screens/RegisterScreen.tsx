import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
// 1. IMPORT CORRIGIDO
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from 'expo-checkbox';
import { FontAwesome } from '@expo/vector-icons';

// 2. IMPORT DO NOVO COMPONENTE
import { StyledButton } from '@/components/StyledButton'; 

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !password || !email) {
      Alert.alert('Erro', 'Preencha todos os campos: nome, email e senha.');
      return;
    }
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);

    if (success) {
      Alert.alert('Sucesso', 'Cadastro realizado!');
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <FontAwesome name="bookmark" size={28} color="#5856D6" style={styles.logo} />

          <Text style={styles.title}>Sign up</Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Jon Snow"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.checkboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? '#5856D6' : '#555'}
            />
            <Text style={styles.checkboxLabel}>I want to receive updates via email.</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#FFF" />
          ) : (
            // 3. USANDO O NOVO COMPONENTE
            <StyledButton title="Sign up" onPress={handleRegister} />
          )}

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <StyledButton
            title="Sign up with Google"
            variant="outline"
            onPress={() => Alert.alert('Login Social', 'Login com Google Clicado')}
            icon={<FontAwesome name="google" size={18} color="#FFF" style={styles.icon} />}
          />
          <StyledButton
            title="Sign up with Facebook"
            variant="outline"
            onPress={() => Alert.alert('Login Social', 'Login com Facebook Clicado')}
            icon={<FontAwesome name="facebook" size={18} color="#FFF" style={styles.icon} />}
          />

          {/* 4. CORREÇÃO DO ERRO 'Text strings...' */}
          <Text style={styles.linkTextBase}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.goBack()}>
              Sign in
            </Text>
          </Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ESTILOS ATUALIZADOS
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 24,
    width: '100%',
  },
  logo: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 16,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 4,
  },
  checkboxLabel: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#94A3B8',
    marginHorizontal: 10,
  },
  icon: {
    marginRight: 12,
  },
  // 5. ESTILOS DO LINK ATUALIZADOS
  linkTextBase: {
    color: '#CBD5E1',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  link: {
    color: '#5856D6',
    fontWeight: 'bold',
  },
});