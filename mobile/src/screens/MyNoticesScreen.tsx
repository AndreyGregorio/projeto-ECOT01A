import React, { useState, useCallback } from 'react';
// --- MUDANÇA: Importar TouchableOpacity e useNavigation ---
import { 
  View, Text, FlatList, StyleSheet, 
  ActivityIndicator, RefreshControl, TouchableOpacity 
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { NoticeCard, Notice } from '@/components/NoticeCard'; 
import { Feather } from '@expo/vector-icons'; // --- MUDANÇA: Importar Feather

export default function MyNoticesScreen() {
  const { token, API_URL } = useAuth(); // <--- O API_URL ESTÁ AQUI
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigation = useNavigation(); // --- MUDANÇA: Hook de navegação ---

  const fetchNotices = async () => {
    // ... (função fetchNotices continua igual) ...
    try {
      const response = await fetch(`${API_URL}/notices/feed`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setNotices(data);
      } else {
        console.error("Erro ao buscar avisos:", data.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchNotices();
    }, [token, API_URL])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotices();
  };

  // --- MUDANÇA: Função para navegar ---
  const handleGoToCreate = () => {
    // @ts-ignore <-- ADICIONE ESTA LINHA
    navigation.navigate('CreateNotice'); // O nome da nossa futura tela
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    // --- MUDANÇA: Envolver em View para o FAB funcionar ---
    <View style={styles.container}>
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        
        // --- A ÚNICA MUDANÇA ESTÁ AQUI ---
        // Nós estamos passando a API_URL para dentro do Card
        renderItem={({ item }) => (
          <NoticeCard notice={item} api_url={API_URL} /> 
        )}
        // --- FIM DA MUDANÇA ---

        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={(
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhum aviso encontrado.</Text>
            <Text style={styles.emptySubText}>Siga quadros na aba "Quadros" para vê-los aqui.</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      
      {/* --- MUDANÇA: O Botão Flutuante (+) --- */}
      <TouchableOpacity style={styles.fab} onPress={handleGoToCreate}>
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2', 
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  // --- MUDANÇA: Estilo do Botão Flutuante ---
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000', // Preto, para combinar com seu app
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});