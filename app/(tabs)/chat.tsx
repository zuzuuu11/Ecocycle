import { apiChatMessage } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Msg = {
  id: string;
  text: string;
  isBot: boolean;
};

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'welcome',
      text: 'Olá! Sou o assistente EcoCycle. Pergunte sobre descarte (plástico, papel, eletrônicos, óleo) ou impacto ambiental.',
      isBot: true,
    },
  ]);
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, text: trimmed, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setSending(true);
    try {
      const { ok, data } = await apiChatMessage(trimmed);
      const reply =
        ok && typeof data.reply === 'string'
          ? data.reply
          : 'Não consegui contactar o servidor. Verifique a API ou tente de novo.';
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, text: reply, isBot: true }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          text: 'Erro de rede. Confirme se o backend está a correr.',
          isBot: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EcoCycle IA</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageContainer}>
              {msg.isBot ? (
                <View style={styles.botMessage}>
                  <Text style={styles.botMessageText}>{msg.text}</Text>
                </View>
              ) : (
                <View style={styles.userMessageContainer}>
                  <View style={styles.userMessage}>
                    <Text style={styles.userMessageText}>{msg.text}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Escreva a sua pergunta"
            placeholderTextColor="#9E9E9E"
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!sending}
          />
          <TouchableOpacity
            style={[styles.sendButton, sending && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={sending}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  flexContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 24,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  botMessage: {
    backgroundColor: '#E1BEE7',
    borderRadius: 15,
    padding: 15,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  botMessageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  userMessage: {
    backgroundColor: '#9C27B0',
    borderRadius: 15,
    padding: 15,
    maxWidth: '80%',
  },
  userMessageText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#9C27B0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});
