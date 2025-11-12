import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';



import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';

interface UserSearchResult {
  id: number;
  name: string;
  username: string;
  avatar_url: string | null;
  is_following_by_me: boolean;
}

function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Cria um timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o 'value' mudar (usuário continuou digitando)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


//Componente para o Item da Lista
const UserResultItem: React.FC<{ user: UserSearchResult }> = ({ user }) => {
  const { API_URL, token } = useAuth();
  const navigation = useNavigation<any>();

  // Estado de "seguir" local para este item
  const [isFollowing, setIsFollowing] = useState(user.is_following_by_me);
  const [isLoading, setIsLoading] = useState(false);

  // Helper para a URL da imagem (igual ao do HomeScreen)
  const getSafeImageUri = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return { uri: path };
    if (path.startsWith('/')) return { uri: `${API_URL}${path}` };
    return null;
  };
  
  const avatarSource = getSafeImageUri(user.avatar_url);

  const goToProfile = () => {
    navigation.navigate('Main', { 
      screen: 'Profile',         
      params: { username: user.username }, 
    });
  };

  // Lógica de seguir/parar de seguir
  const handleToggleFollow = async () => {
    setIsLoading(true);
    const action = isFollowing ? 'unfollow' : 'follow';
    const method = isFollowing ? 'DELETE' : 'POST';

    try {
      const response = await fetch(
        `${API_URL}/users/${user.username}/${action}`,
        {
          method: method,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error('Falha na operação.');
      
      //Atualiza o estado local
      setIsFollowing(!isFollowing); 

    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.resultItem} onPress={goToProfile}>
      {avatarSource ? (
        <Image source={avatarSource} style={styles.avatar} />
      ) : (
        <View style={styles.avatar} />
      )}
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>
      
      {/* Botão Dinâmico */}
      <TouchableOpacity
        style={[
          styles.followButton,
          isFollowing ? styles.unfollowButton : styles.followButtonActive,
        ]}
        onPress={handleToggleFollow}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={isFollowing ? '#333' : '#FFF'} />
        ) : (
          <Text
            style={[
              styles.followButtonText,
              isFollowing ? styles.unfollowButtonText : styles.followButtonTextActive,
            ]}
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};


// Tela Principal de Busca
export default function SearchScreen() {
  const { API_URL, token } = useAuth();
  const navigation = useNavigation();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  //função que chama a API
  const searchUsers = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/search/users?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error('Falha ao buscar.');
      const data: UserSearchResult[] = await response.json();
      setResults(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      searchUsers(debouncedQuery);
    } else {
      setResults([]); 
    }
  }, [debouncedQuery]); 

  const textInputRef = React.useRef<TextInput>(null);
  useFocusEffect(useCallback(() => {
    textInputRef.current?.focus();
  }, []));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TextInput
          ref={textInputRef}
          style={styles.searchInput}
          placeholder="Buscar usuários..."
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {loading && <ActivityIndicator style={{ marginLeft: 8 }} />}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserResultItem user={item} />}
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    marginLeft: 16,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#828282',
  },
  // Estilos do Item de Resultado
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEE',
    marginRight: 12,
  },
  userInfo: {
    flex: 1, // Ocupa o espaço
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  followButtonActive: {
    backgroundColor: '#007AFF',
  },
  unfollowButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  followButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  followButtonTextActive: {
    color: '#FFFFFF',
  },
  unfollowButtonText: {
    color: '#333',
  },
});