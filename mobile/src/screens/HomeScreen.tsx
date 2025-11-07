import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      
      {/* Post Fixo 1 */}
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>Post Fixo 1</Text>
        <Text style={styles.postContent}>
          Este é o conteúdo do primeiro post fixo. Pode ser uma notícia, 
          um aviso ou qualquer informação estática que você queira exibir.
        </Text>
      </View>

      {/* Post Fixo 2 */}
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>Post Fixo 2</Text>
        <Text style={styles.postContent}>
          Aqui está o segundo post. Você pode adicionar quantos posts 
          fixos quiser, apenas copiando e colando este bloco.
        </Text>
      </View>
      
      {/* Post Fixo 3 */}
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>Post Fixo 3</Text>
        <Text style={styles.postContent}>
          Mais um post para preencher a tela.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40, // Espaço do topo
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
  },
});