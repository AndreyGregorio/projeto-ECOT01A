<<<<<<< HEAD
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
=======
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

//interface para posts
interface Post {
  id: number;
  author: string;
  timestamp: string;
  content: string;
}

//Componente Reutilizável PostCard
const PostCard: React.FC<{ post: Post }> = ({ post }) => (
  <View style={cardStyles.postContainer}>
    {/* Cabeçalho do Post */}
    <View style={cardStyles.header}>
      <Text style={cardStyles.authorText}>@{post.author}</Text>
      <Text style={cardStyles.timestampText}>{post.timestamp}</Text>
    </View>

    {/* Conteúdo do Post */}
    <Text style={cardStyles.contentText}>{post.content}</Text>

    {/* Interações (Placeholder para o MVP Intermediário) */}
    <View style={cardStyles.actions}>
      <Text style={cardStyles.actionText}>Curtir (0)</Text>
      <Text style={cardStyles.actionText}>Comentar (0)</Text>
    </View>
  </View>
);

//Estilos específicos para o PostCard
const cardStyles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#FFFFFF', // Fundo branco
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    authorText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3B82F6', // Azul UNIFEI/Similar
    },
    timestampText: {
        fontSize: 12,
        color: '#6B7280',
    },
    contentText: {
        fontSize: 16,
        lineHeight: 22,
        color: '#1F2937',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    actionText: {
        fontSize: 14,
        marginRight: 20,
        color: '#4B5563',
    }
});

//Posts fixos
const staticPosts: Post[] = [
  {
    id: 1,
    author: 'Reitoria UNIFEI',
    timestamp: '7 de Nov de 2025',
    content:
      'Bem-vindo(a) à **Rede Unifei**! Este é o seu novo ponto de encontro social para a comunidade acadêmica. Utilize o app para acompanhar as notícias.',
  },
  {
    id: 2,
    author: 'Prof. Edvard Oliveira',
    timestamp: '6 de Nov de 2025',
    content:
      'Lembrando a todos: a entrega do **Segundo Trabalho (Rede Social)** é em 23 de novembro de 2025. Caprichem na documentação e no MVP!',
  },
  {
    id: 3,
    author: 'Secretaria Acadêmica',
    timestamp: '5 de Nov de 2025',
    content:
      'O **Calendário Acadêmico de 2025/2** está disponível. Fiquem atentos às datas de provas e feriados.',
  },
];



export function HomeScreen() {
  const { logout } = useAuth(); // Pegamos o logout
>>>>>>> afd1393c68a7998affcb53060694391de83e4d82

export default function HomeScreen() {
  return (
<<<<<<< HEAD
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
=======
 <View style={styles.outerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
        
        {/* Cabeçalho */}
        <Text style={styles.title}>Rede Social UNIFEI</Text>
        <Text style={styles.subtitle}>Feed de Notícias (MVP Básico)</Text>

        {/* --- Posts Fixos (Mapeamento do array) --- */}
        <View style={styles.feedContainer}>
            {staticPosts.map((post) => (
            <PostCard key={post.id} post={post} />
            ))}
        </View>
        {/* --- Fim dos Posts --- */}

        {/* Botão de Logout */}
        <View style={styles.logoutButtonContainer}>
            <Button title="Sair (Logout)" onPress={logout} color="#EF4444" />
        </View>

        </ScrollView>
    </View>
>>>>>>> afd1393c68a7998affcb53060694391de83e4d82
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    padding: 20,
    backgroundColor: "#fff",
=======
    padding: 15,
    backgroundColor: '#F3F4F6', // Fundo cinza claro
>>>>>>> afd1393c68a7998affcb53060694391de83e4d82
  },
  scrollView: {
    flex: ,
  },
  scrollContainer: {
    padding: 15,
  },  
  title: {
<<<<<<< HEAD
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
=======
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 5,
  },
  feedContainer: {
    // Para separar o feed do cabeçalho
    marginBottom: 20, 
  },
  logoutButtonContainer: {
    marginTop: 10,
    marginBottom: 30, // Espaço extra no fim da rolagem
  }
});
>>>>>>> afd1393c68a7998affcb53060694391de83e4d82
