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

type NoticeCardProps = {
  notice: Notice;
  onPress?: () => void;
};

// Componente para renderizar o anexo (Imagem ou PDF)
const NoticeAttachment: React.FC<{ file_url: string; file_type: string }> = ({ file_url, file_type }) => {
  if (file_type === 'image') {
    return (
      <Image 
        source={{ uri: file_url }} 
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

  return null; // Sem anexo ou tipo desconhecido
};

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onPress }) => {
  
  // --- DEFINIÇÃO DO TIMEAGO ---
  // A variável precisa ser definida AQUI, dentro do componente
  const timeAgo = formatDistanceToNow(new Date(notice.created_at), {
    addSuffix: true,
    locale: ptBR,
  });
  // --- FIM DA DEFINIÇÃO ---

  return (
    <View style={styles.card}>
      {/* Cabeçalho com Autor e Tempo */}
      <View style={styles.header}>
        <Image 
          source={notice.author_avatar ? { uri: notice.author_avatar } : require('../assets/image/default-avatar.png')} 
          style={styles.avatar} 
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.authorName}>{notice.author_name}</Text>
          {/* E aqui ela é usada */}
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
        <NoticeAttachment file_url={notice.file_url} file_type={notice.file_type} />
      )}
    </View>
  );
};

// --- ESTILOS ---
// (Sem mudanças aqui, mantive o que já estava)
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
    backgroundColor: '#E0EFFF', // Um azul leve para "Matéria"
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