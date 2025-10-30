// src/screens/TestBackendScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';

// -------------------------------------------------------------------
// ⚠️ IMPORTANTE: Ajuste este IP!
// Leia a explicação "O Pulo do Gato" abaixo.
// NÃO USE 'localhost', use o IP da sua máquina na rede Wi-Fi.
const API_URL = 'http://192.168.1.10:3000'; 
// -------------------------------------------------------------------

export function TestBackendScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Clique no botão para testar...');
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    setMessage('Testando conexão...');

    try {
      // Tenta fazer a requisição para a rota /test
      const response = await fetch(`${API_URL}/test`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Sucesso!
      setMessage(data.message);
      console.log('Resposta do Backend:', data);

    } catch (e: any) {
      // Falha
      console.error(e);
      setError(`Falha ao conectar: ${e.message}. Verifique o IP e se o servidor backend está rodando.`);
      setMessage('Clique no botão para testar...');
      Alert.alert('Erro', `Não foi possível conectar ao backend. Verifique o console e o IP configurado.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de Conexão com Backend</Text>
      
      <Text style={styles.message}>{message}</Text>
      
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Testar Conexão" onPress={handleTestConnection} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});