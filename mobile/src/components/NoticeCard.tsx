import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// O tipo de dado que esperamos da API (Rota 24)
export type Notice = {
  id: string;
  subject: string;
  content: string;
  file_url: string | null;
  file_type: 'image' | 'pdf' | null;
  created_at: string;
  board_name: string;
  author_name: string;
  author_avatar: string | null;
};

// --- MUDANÇA 1: AQUI ESTÁ A CORREÇÃO ---
// Adicionamos a 'api_url' às regras do componente
type NoticeCardProps = {
  notice: Notice;
  onPress?: () => void;
  api_url: string; // <-- A PROP QUE FALTAVA
};

// --- MUDANÇA 2: O componente de anexo agora recebe a url ---
const NoticeAttachment: React.FC<{ file_url: string; file_type: string; api_url: string }> = ({ file_url, file_type, api_url }) => {
  if (file_type === 'image') {
    return (
      <Image 
        // 3. USANDO A API_URL AQUI (no anexo)
        source={{ uri: api_url + file_url }} 
        style={styles.imageAttachment} 
        resizeMode="cover" 
      />
    );
  }

  if (file_type === 'pdf') {
    return (
      <TouchableOpacity style={styles.pdfAttachment}>
        <Feather name="file-text" size={24} color="#D9534F" />
        <Text style={styles.pdfText}>Ver PDF (em breve)</Text>
      </TouchableOpacity>
    );
  }

  return null; 
};

// --- MUDANÇA 4: O componente principal agora recebe a prop ---
export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onPress, api_url }) => {
  
  const timeAgo = formatDistanceToNow(new Date(notice.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image 
          // 5. USANDO A API_URL AQUI (no avatar)
          // E usando o caminho do seu logo.svg que já tínhamos corrigido
          source={notice.author_avatar ? { uri: api_url + notice.author_avatar } : require('../assets/image/default-avatar.png')} 
          style={styles.avatar} 
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.authorName}>{notice.author_name}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
      </View>

      {/* Tags de Quadro e Matéria */}
      <View style={styles.tagsContainer}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{notice.board_name}</Text>
        </View>
        <View style={[styles.tag, styles.subjectTag]}>
          <Text style={styles.tagText}>{notice.subject}</Text>
        </View>
      </View>

      {/* Conteúdo */}
      <Text style={styles.content}>{notice.content}</Text>

      {/* Anexo */}
      {notice.file_url && notice.file_type && (
        // 6. PASSANDO A API_URL PARA O COMPONENTE DE ANEXO
        <NoticeAttachment file_url={notice.file_url} file_type={notice.file_type} api_url={api_url} />
      )}
    </View>
  );
};

// --- Estilos (sem mudança) ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F0F0F0',
  },
  authorName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  subjectTag: {
    backgroundColor: '#E0EFFF', 
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
  },
  content: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  imageAttachment: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: '#F0F0F0', // Fica cinza enquanto carrega
  },
  pdfAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  pdfText: {
    marginLeft: 10,
    color: '#D9534F',
    fontWeight: '500',
  }
});