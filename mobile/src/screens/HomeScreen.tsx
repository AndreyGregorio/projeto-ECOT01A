import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  StatusBar 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// 👇 MUDANÇA 1: Importar o hook de autenticação
import { useAuth } from '@/contexts/AuthContext'; // (confirme se este é o caminho certo)

// --- Tipos (que já corrigimos antes) ---
type PostProps = {
  autor: string;
  conteudo: string;
};

// Componente de Post Fixo (sem mudança)
const PostFixo: React.FC<PostProps> = ({ autor, conteudo }) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <View style={styles.postAvatar} />
      <Text style={styles.postAutor}>{autor}</Text>
    </View>
    <Text style={styles.postConteudo}>{conteudo}</Text>
  </View>
);

export default function HomeScreen() {
  
  // 👇 MUDANÇA 2: Pegar a função logout do contexto
  const { logout } = useAuth();
  
  // 👇 MUDANÇA 3: Usar a função logout no handleSair
  const handleSair = () => {
    // Adicione sua lógica de logout aqui
    console.log("Usuário clicou em Sair");
    logout(); // <--- A MÁGICA ACONTECE AQUI
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. HEADER (Cabeçalho) */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Para você</Text>
        {/* Botão de Sair (agora funcional) */}
        <TouchableOpacity onPress={handleSair} style={styles.botaoSair}>
          <Feather name="log-out" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 2. FEED (Posts Fixos) */}
      <ScrollView style={styles.feed} contentContainerStyle={{ paddingBottom: 20 }}>
        
        <PostFixo 
          autor="República Faraó" 
          conteudo="Festa do Pijama NESTE SÁBADO! Ingressos no link da bio. Não perca!" 
        />
        <PostFixo 
          autor="Atlética Eng" 
          conteudo="VENDAS ABERTAS para os Jogos Universitários. Garanta seu pacote!" 
        />
        <PostFixo 
          autor="D.A. Computação" 
          conteudo="Semana da Computação confirmada. Palestrantes em breve." 
        />

      </ScrollView>

      {/* 3. TAB BAR (Barra de Navegação) */}
      {/* Nota: Se esta tela está DENTRO do seu MainBottomTabs, 
        você não precisa declarar esta TabBar aqui. 
        O MainBottomTabs já vai renderizar ela.
        Vou deixar aqui por via das dúvidas. 
      */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="search" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabItem, styles.tabItemCentral]}>
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="notifications-outline" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <MaterialCommunityIcons name="account-circle" size={24} color="#888" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// === ESTILOS (O "CSS" DO REACT NATIVE) ===
// (Nenhuma mudança nos estilos, omitido para economizar espaço)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  botaoSair: {
    padding: 4,
  },
  feed: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDD',
    marginRight: 12,
  },
  postAutor: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postConteudo: {
    fontSize: 14,
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemCentral: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000000',
    transform: [{ translateY: -15 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});