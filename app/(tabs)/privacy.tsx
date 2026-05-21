import { ProfileSubScreen } from '@/components/profile-sub-screen';
import React, { useState } from 'react';
import { Linking, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacyScreen() {
  const [usageStats, setUsageStats] = useState(false);
  const [personalizedTips, setPersonalizedTips] = useState(true);

  return (
    <ProfileSubScreen title="Privacidade">
      <Text style={styles.intro}>
        Controle como o EcoCycle usa dados neste dispositivo. Políticas completas podem ser
        hospedadas na web quando o produto estiver em produção.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Estatísticas de uso no app</Text>
            <Text style={styles.rowSubtitle}>
              Ajuda a melhorar telas mais usadas (armazenado só localmente nesta versão).
            </Text>
          </View>
          <Switch
            value={usageStats}
            onValueChange={setUsageStats}
            trackColor={{ false: '#ccc', true: '#E1BEE7' }}
            thumbColor={usageStats ? '#9C27B0' : '#f4f3f4'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Dicas personalizadas</Text>
            <Text style={styles.rowSubtitle}>
              Priorizar conteúdo com base no que você já consultou no app.
            </Text>
          </View>
          <Switch
            value={personalizedTips}
            onValueChange={setPersonalizedTips}
            trackColor={{ false: '#ccc', true: '#E1BEE7' }}
            thumbColor={personalizedTips ? '#9C27B0' : '#f4f3f4'}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Política de privacidade</Text>
      <Text style={styles.body}>
        O EcoCycle trata o seu e-mail e nome apenas para exibir a conta neste aplicativo. Não
        vendemos os seus dados. Funcionalidades futuras (nuvem, login social) serão descritas
        aqui com detalhes.
      </Text>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() =>
          Linking.openURL('https://expo.dev').catch(() => {
            /* noop */
          })
        }
      >
        <Text style={styles.linkButtonText}>Abrir página de privacidade (exemplo)</Text>
      </TouchableOpacity>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  linkButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  linkButtonText: {
    color: '#4CAF50',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
