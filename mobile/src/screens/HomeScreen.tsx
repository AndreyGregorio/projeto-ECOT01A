import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert,
  StatusBar,
  TouchableOpacity 
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
// <-- MUDANÇA 1: Importar o 'useNavigation'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

// --- 1. ATUALIZAR A INTERFACE POST ---
export interface Post {
  id: number;
  content: string | null;
  image_url: string | null;
  created_at: string;
  author_name: string;
  author_avatar: string | null;
  total_likes: number;  
  liked_by_me: boolean;
  total_comments: number; // <-- MUDANÇA 2: Adicionada a contagem
}

// --- 2. ATUALIZAR O PostItem ---
export const PostItem: React.FC<{ post: Post, onToggleLike: (postId: number) => void }> = ({ post, onToggleLike }) => {
  
  const authorAvatarSource = post.author_avatar ? { uri: post.author_avatar } : null; 
  const likeIcon = post.liked_by_me ? 'heart' : 'heart-outline';
  const likeColor = post.liked_by_me ? '#E23C3C' : '#333'; 

  // <-- MUDANÇA 3: Pegar o hook de navegação
  const navigation = useNavigation<any>();

  // Função para navegar para os comentários
  const goToComments = () => {
    // Navega para a tela 'Comments' (que registramos no AppNavigator)
    // e passa o 'postId' para ela saber quais comentários buscar.
    navigation.navigate('Comments', { postId: post.id });
  };

  return (
    <View style={styles.postContainer}>
      {/* ... (Cabeçalho do Post - sem mudança) ... */}
      <View style={styles.postHeader}>
        {authorAvatarSource ? (
          <Image source={authorAvatarSource} style={styles.postAvatar} />
        ) : (
          <View style={styles.postAvatar} />
        )}
        <Text style={styles.postAutor}>{post.author_name}</Text>
      </View>
      
      {/* ... (Conteúdo do Post - sem mudança) ... */}
      {post.content && ( <Text style={styles.postConteudo}>{post.content}</Text> )}
      {post.image_url && ( <Image source={{ uri: post.image_url }} style={styles.postImage} /> )}

      {/* --- SEÇÃO DE INTERAÇÃO ATUALIZADA --- */}
      <View style={styles.interactionBar}>
        {/* Botão de Like (sem mudança) */}
        <TouchableOpacity 
          style={styles.interactionButton}
          onPress={() => onToggleLike(post.id)}
        >
          <Ionicons name={likeIcon} size={24} color={likeColor} />
          <Text style={[styles.interactionText, { color: likeColor }]}>
            {post.total_likes}
          </Text>
        </TouchableOpacity>
        
        {/* <-- MUDANÇA 4: Botão de Comentário agora é funcional --> */}
        <TouchableOpacity 
          style={styles.interactionButton}
          onPress={goToComments} // <-- Chama a função de navegar
        >
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
          <Text style={styles.interactionText}>
            {post.total_comments} {/* <-- Mostra a contagem real */}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- 3. HomeScreen (Componente Principal) ---
// NENHUMA MUDANÇA NECESSÁRIA AQUI!
// O 'fetchPosts' já pega todos os dados (incluindo 'total_comments')
// e o 'handleToggleLike' já funciona.
export default function HomeScreen() {
  const { API_URL, token, user } = useAuth(); 
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    if (!user) return; 
    
    try {
      const response = await fetch(`${API_URL}/posts`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) { throw new Error('Falha ao buscar posts'); }
      
      // O 'data' agora magicamente inclui 'total_comments' vindo do backend
      const data: Post[] = await response.json(); 
      setPosts(data);
    } catch (error: any) {
      console.error(error.message);
      Alert.alert('Erro', 'Não foi possível carregar o feed.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchPosts(); }, [user]));
  const onRefresh = useCallback(() => { setRefreshing(true); fetchPosts(); }, [user]);

  const handleToggleLike = async (postId: number) => {
    setPosts(currentPosts => 
      currentPosts.map(p => {
        if (p.id === postId) {
          const newLikedByMe = !p.liked_by_me;
          const newTotalLikes = newLikedByMe ? p.total_likes + 1 : p.total_likes - 1;
          return { ...p, liked_by_me: newLikedByMe, total_likes: newTotalLikes };
        }
        return p;
      })
    );

    try {
      await fetch(`${API_URL}/posts/${postId}/toggle-like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar a curtida.');
      fetchPosts(); 
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostItem 
            post={item} 
            onToggleLike={handleToggleLike} 
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.feed}
        // ... (RefreshControl e ListEmptyComponent sem mudança)
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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

// --- 4. ESTILOS (Sem mudança) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5', },
  feed: { flex: 1, },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F2F5', },
  emptyContainer: { flex: 1, paddingTop: 150, alignItems: 'center', },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', },
  emptySubText: { fontSize: 14, color: '#828282', marginTop: 8, },
  postContainer: { backgroundColor: '#FFFFFF', padding: 16, marginVertical: 8, marginHorizontal: 16, borderRadius: 8, elevation: 1, },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, },
  postAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEE', marginRight: 12, },
  postAutor: { fontWeight: 'bold', fontSize: 16, },
  postConteudo: { fontSize: 15, lineHeight: 22, marginBottom: 12, },
  postImage: { width: '100%', aspectRatio: 16/9, borderRadius: 8, backgroundColor: '#EEE', marginTop: 8, },
  interactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24, 
  },
  interactionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  }
});