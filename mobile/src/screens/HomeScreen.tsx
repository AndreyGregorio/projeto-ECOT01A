// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export function HomeScreen() {
  const { logout } = useAuth(); // Pegamos o logout

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Página Inicial</Text>
      <Text style={styles.subtitle}>Bem-vindo! (Posts Fixos)</Text>

      {/* --- Posts Fixos --- */}
      <View style={styles.post}>
        <Text style={styles.postTitle}>Post 1: O que é React Native?</Text>
        <Text>React Native permite construir apps móveis usando React e JavaScript. Você escreve o código uma vez e ele roda em Android e iOS.</Text>
      </View>

      <View style={styles.post}>
        <Text style={styles.postTitle}>Post 2: Backend com Node.js</Text>
        <Text>Nosso backend usa Node.js, Express e PostgreSQL para criar uma API RESTful segura com autenticação JWT.</Text>
      </View>

      <View style={styles.post}>
        <Text style={styles.postTitle}>Post 3: Próximos Passos</Text>
        <Text>O próximo passo seria carregar esses posts dinamicamente do backend, criando uma nova rota e uma nova tabela no banco!</Text>
      </View>
      {/* --- Fim dos Posts --- */}

      <Button title="Sair (Logout)" onPress={logout} color="red" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  post: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});