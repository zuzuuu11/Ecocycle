import { ProfileSubScreen } from '@/components/profile-sub-screen';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Faq = { q: string; a: string };

const FAQS: Faq[] = [
  {
    q: 'Como escanear um produto?',
    a: 'Na aba Escanear, conceda permissão à câmera e aponte para o código de barras até o app reconhecer.',
  },
  {
    q: 'Onde vejo pontos de descarte?',
    a: 'Em Início, toque em “Encontrar pontos próximos”, ou use Meus serviços no perfil.',
  },
  {
    q: 'Esqueci minha senha. E agora?',
    a: 'Por enquanto o app é demonstrativo. Em produção, use “Solicitar redefinição” na Central de segurança.',
  },
  {
    q: 'Como falar com suporte?',
    a: 'Use o e-mail de contato abaixo ou o assistente na aba Assistente.',
  },
];

export default function HelpScreen() {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <ProfileSubScreen title="Central de ajuda">
      <Text style={styles.intro}>Perguntas frequentes e canais de contato.</Text>

      <View style={styles.faqBox}>
        {FAQS.map((item, index) => {
          const open = openId === index;
          return (
            <View key={item.q} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setOpenId(open ? null : index)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestion}>{item.q}</Text>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
              </TouchableOpacity>
              {open ? <Text style={styles.faqAnswer}>{item.a}</Text> : null}
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Contato</Text>
      <TouchableOpacity
        style={styles.contactRow}
        onPress={() =>
          Linking.openURL('mailto:suporte@ecocycle.app?subject=Ajuda%20EcoCycle').catch(() =>
            Alert.alert('E-mail', 'suporte@ecocycle.app')
          )
        }
      >
        <Ionicons name="mail-outline" size={22} color="#4CAF50" />
        <Text style={styles.contactText}>suporte@ecocycle.app</Text>
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.contactRow}
        onPress={() => Alert.alert('Telefone', 'Em breve: linha 0800 de atendimento.')}
      >
        <Ionicons name="call-outline" size={22} color="#4CAF50" />
        <Text style={styles.contactText}>Falar com atendimento</Text>
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </TouchableOpacity>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  faqBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 24,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  faqAnswer: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
