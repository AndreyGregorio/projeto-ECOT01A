// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth(); // Pegamos a função register

  const handleRegister = async () => {
    if (!name || !password) {
      Alert.alert('Erro', 'Preencha nome e senha.');
      return;
    }
    setLoading(true);
    const success = await register(name, password);
    setLoading(false);
    
    if (success) {
      // Se o cadastro deu certo, volta para a tela de Login
      navigation.goBack(); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome de usuário"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Cadastrar" onPress={handleRegister} />
      )}
    </View>
  );
}

// (Pode reusar os estilos do LoginScreen, mas vou colar aqui para ficar completo)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});