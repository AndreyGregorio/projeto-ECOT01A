
import React, { useState } from 'react';
// Adicione 'Alert' aqui
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native'; 
import { useAuth } from '@/contexts/AuthContext';


// O React Navigation nos dá a prop 'navigation'
export function LoginScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Pegamos a função login do nosso contexto

  const handleLogin = async () => {
    if (!name || !password) {
      Alert.alert('Erro', 'Preencha nome e senha.');
      return;
    }
    setLoading(true);
    const success = await login(name, password); // Chama o login
    if (!success) {
      setLoading(false); // Se falhar, para o loading
    }
    // Se der sucesso, o AppNavigator vai cuidar de trocar a tela
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
        <>
          <Button title="Entrar" onPress={handleLogin} />
          <View style={styles.separator} />
          <Button 
            title="Não tem conta? Cadastre-se" 
            onPress={() => navigation.navigate('Register')} // Navega para a tela de Registro
          />
        </>
      )}
    </View>
  );
}

// Estilos básicos
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
  separator: {
    height: 10,
  }
});