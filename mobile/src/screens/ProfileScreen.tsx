// 📁 src/screens/ProfileScreen.tsx (ATUALIZADO)

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext'; 
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Post, PostItem } from './HomeScreen'; // Importa o post

export default function ProfileScreen() {
  const { user, token, API_URL } = useAuth();
  
  // Estado SÓ para os posts
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // --- Funções (Agora só temos 2) ---

  const fetchUserPosts = async () => {
    if (!user) return; 
    setLoadingPosts(true);
    try {
      const response = await fetch(`${API_URL}/posts/user/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Falha ao buscar posts');
      const data: Post[] = await response.json();
      setUserPosts(data); 
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar seus posts.');
    } finally {
      setLoadingPosts(false);
    }
  };
  
  // Recarrega os posts quando o usuário foca a tela
  useFocusEffect(useCallback(() => {
    if (user) { 
      fetchUserPosts();
    }
  }, [user])); 

  const handleDeletePost = (postId: number) => {
    Alert.alert("Apagar Post", "Você tem certeza?",
      [{ text: "Cancelar", style: "cancel" },
       { text: "Apagar", style: "destructive", 
         onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
              if (!response.ok && response.status !== 204) { throw new Error('Falha ao apagar.'); }
              setUserPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
              Alert.alert('Sucesso', 'Post apagado.');
            } catch (error: any) { Alert.alert('Erro', error.message); }
         } 
       }]
    );
  };
  // --- Fim das Funções ---

  if (!user) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  
  const avatarSource = user.avatar_url ? { uri: user.avatar_url } : null;

  // O Cabeçalho (SÓ display)
  const renderProfileHeader = () => {
    const navigation = useNavigation<any>();
    
    return (
      <View style={styles.headerContainer}>
        
        {/* Botão de Engrenagem (sem mudança) */}
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => navigation.navigate('Settings')} 
        >
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.profileHeader}>
          {avatarSource ? <Image source={avatarSource} style={styles.avatar} /> : <View style={styles.avatar} />}
        </View>
        <View style={styles.displayContainer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.course}>{user.course || 'Sem curso definido'}</Text>
          <Text style={styles.bio}>{user.bio || 'Sem bio definida'}</Text>

          {/* Botão "Editar Perfil" FOI REMOVIDO DAQUI */}
        </View>
        
        <Text style={styles.postsTitle}>Meus Posts</Text>
      </View>
    );
  };

  // O componente principal agora é SÓ a lista
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderProfileHeader}
        renderItem={({ item }) => (
          <View style={styles.postWrapper}>
            <PostItem post={item} /> 
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePost(item.id)}>
              <Ionicons name="trash-outline" size={20} color="#DC3545" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={!loadingPosts ? <Text style={styles.emptyPostsText}>Você ainda não fez nenhum post.</Text> : null}
        ListFooterComponent={loadingPosts ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null}
      />
    </SafeAreaView>
  );
}

// Estilos (Simplificados)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { paddingTop: 10, width: '100%', alignItems: 'center' },
  profileHeader: { position: 'relative', alignItems: 'center', marginBottom: 24, marginTop: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#000000', backgroundColor: '#EEE' },
  displayContainer: { width: '100%', alignItems: 'center', paddingHorizontal: 16 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  course: { fontSize: 16, color: '#555', marginBottom: 12 },
  bio: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 16 },
  postsTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', width: '100%', marginTop: 24, marginBottom: 10, paddingHorizontal: 16 }, 
  postWrapper: { position: 'relative', paddingHorizontal: 16 },
  deleteButton: { position: 'absolute', top: 16, right: 24, backgroundColor: '#FFFFFF', borderRadius: 15, padding: 4, elevation: 2 },
  emptyPostsText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#828282' },
  settingsButton: { position: 'absolute', top: 12, right: 16, zIndex: 10, padding: 8, }
});