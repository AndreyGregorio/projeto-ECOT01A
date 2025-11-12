import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  FlatList, // Usamos FlatList, é melhor que ScrollView para listas
  ActivityIndicator,
  Image,
  RefreshControl, // Para "puxar para atualizar"
  Alert, // Para mostrar erros
  StatusBar // Você já tinha
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext'; // Para pegar a API_URL
import { useFocusEffect } from '@react-navigation/native'; // Para recarregar a tela

// --- 1. Definir o tipo do Post (como vem do Backend) ---
// Isso vem da sua rota GET /posts (com o JOIN)
export interface Post {
  id: number;
  content: string | null;
  image_url: string | null;
  created_at: string;
  author_name: string;
  author_avatar: string | null;
}

// --- 2. Componente de Post Dinâmico ---
// Este é o "novo" PostFixo, agora ele recebe dados reais
export const PostItem: React.FC<{ post: Post }> = ({ post }) => {
  
  // Lógica para mostrar o avatar (ou um placeholder)
  const authorAvatarSource = post.author_avatar
    ? { uri: post.author_avatar }
    : null; 

  return (
    <View style={styles.postContainer}>
      {/* Cabeçalho do Post (Autor) */}
      <View style={styles.postHeader}>
        {authorAvatarSource ? (
          <Image source={authorAvatarSource} style={styles.postAvatar} />
        ) : (
          <View style={styles.postAvatar} /> // O placeholder cinza
        )}
        <Text style={styles.postAutor}>{post.author_name}</Text>
      </View>
      
      {/* Conteúdo do Post (Texto, se existir) */}
      {post.content && (
        <Text style={styles.postConteudo}>{post.content}</Text>
      )}
      
      {/* Imagem do Post (se existir) */}
      {post.image_url && (
        <Image source={{ uri: post.image_url }} style={styles.postImage} />
      )}
    </View>
  );
};

// --- 3. A Nova HomeScreen (o Feed) ---
export default function HomeScreen() {
  // Pegamos a API_URL e o token para fazer a chamada autenticada
  const { API_URL, token } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Estado para o "puxar"

  /**
   * Função que busca os posts no backend
   */
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, { // Chama a nova rota GET /posts
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar posts');
      }
      const data: Post[] = await response.json();
      setPosts(data); // Salva os posts reais no estado

    // VVV-- A CORREÇÃO ESTÁ AQUI --VVV
    } catch (error: any) { // <-- Era um 'C', agora é '{'
      console.error(error.message);
      Alert.alert('Erro', 'Não foi possível carregar o feed.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * useFocusEffect é um hook que roda toda vez que o usuário
   * FOCA (volta) para esta tela. É perfeito para um feed.
   * Quando você posta e volta, ele atualiza!
   */
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Mostra o loading inicial
      fetchPosts(); // Busca os posts
    }, [])
  );

  /**
   * Função para o "Puxar para atualizar" (Pull-to-refresh)
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Ativa o ícone de "puxando"
    fetchPosts(); // Busca os posts novamente
  }, [fetchPosts]); // <-- Adicionei 'fetchPosts' como dependência aqui

  // 1. Se estiver carregando pela primeira vez, mostre um spinner
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // 2. O feed principal
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Trocamos o <ScrollView> por <FlatList>.
        É MUITO mais performático para listas longas.
      */}
      <FlatList
        data={posts} // A lista de posts do estado
        renderItem={({ item }) => <PostItem post={item} />} // Renderiza cada post
        keyExtractor={(item) => item.id.toString()} // Chave única
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.feed}
        // "Puxar para atualizar"
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Controlado pelo estado 'refreshing'
            onRefresh={onRefresh} // O que fazer ao puxar
          />
        }
        // O que mostrar se a lista de posts vier vazia
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum post ainda.</Text>
            <Text style={styles.emptySubText}>Seja o primeiro a postar!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// --- 4. Estilos Atualizados ---
// (Note que o 'backgroundColor' da safeArea mudou)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Um fundo cinza claro para o feed
  },
  feed: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 150,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubText: {
    fontSize: 14,
    color: '#828282',
    marginTop: 8,
  },
  // Estilos do PostItem (o 'postContainer' antigo)
  postContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16, // Posts agora têm uma margem
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Um pouco mais de espaço
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEE', // Cor do placeholder
    marginRight: 12,
  },
  postAutor: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postConteudo: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  // Novo estilo para a imagem do post
  postImage: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 8,
    backgroundColor: '#EEE',
    marginTop: 8,
  }
});