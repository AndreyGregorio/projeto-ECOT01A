import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, StyleSheet, 
  ActivityIndicator, RefreshControl, TouchableOpacity,
  Alert // <-- 1. IMPORTAR O ALERT
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { NoticeCard, Notice } from '@/components/NoticeCard'; 
import { Feather } from '@expo/vector-icons'; 

export default function MyNoticesScreen() {
  // 2. PRECISAMOS DO 'user' AGORA, NÃO SÓ DO TOKEN
  const { token, API_URL, user } = useAuth(); 
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigation = useNavigation(); 

  const fetchNotices = async () => {
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

  const handleGoToCreate = () => {
    // @ts-ignore 
    navigation.navigate('CreateNotice'); 
  };

  // --- 3. FUNÇÃO DE DELETAR ---
  const handleDeleteNotice = (noticeId: string) => {
    // Confirmação final
    Alert.alert(
      "Apagar Aviso",
      "Tem certeza que deseja apagar este aviso? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Apagar", 
          style: "destructive", 
          onPress: () => performDelete(noticeId) // Chama a função que faz o fetch
        }
      ]
    );
  };

  // --- 4. A LÓGICA DO FETCH DE DELETE ---
  const performDelete = async (noticeId: string) => {
    try {
      const response = await fetch(`${API_URL}/notices/${noticeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) { // status 204
        // Atualização Otimista: Remove o post da lista na tela
        setNotices(currentNotices => 
          currentNotices.filter(notice => notice.id !== noticeId)
        );
        Alert.alert("Sucesso", "Aviso apagado.");
      } else {
        const err = await response.json();
        throw new Error(err.error || "Erro ao apagar");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleEditNotice = (notice: Notice) => {
     // @ts-ignore 
     navigation.navigate('EditNoticeScreen', { notice: notice });
   };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        
        // --- 6. ATUALIZANDO O RENDER ITEM ---
        renderItem={({ item }) => (
          <NoticeCard 
            notice={item} 
            api_url={API_URL} 
            currentUserId={+user!.id} // Passa o ID do usuário logado
            onDelete={handleDeleteNotice} // Passa a função de apagar
            onEdit={handleEditNotice} // Passa a função de editar
          /> 
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
      
      <TouchableOpacity style={styles.fab} onPress={handleGoToCreate}>
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

// ... (Styles sem mudança)
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000', 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
});