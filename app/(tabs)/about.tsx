import { ProfileSubScreen } from '@/components/profile-sub-screen';
import Constants from 'expo-constants';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const APP_NAME = 'EcoCycle';
const VERSION =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

export default function AboutScreen() {
  return (
    <ProfileSubScreen title="Sobre o aplicativo">
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{APP_NAME}</Text>
        <Text style={styles.heroVersion}>Versão {VERSION}</Text>
      </View>

      <Text style={styles.body}>
        O EcoCycle ajuda você a entender o impacto ambiental dos produtos que consome, encontrar
        descarte correto e se conectar com reciclagem e recompensas.
      </Text>

      <Text style={styles.sectionTitle}>Créditos</Text>
      <Text style={styles.body}>
        Desenvolvido com Expo e React Native. Ícones Ionicons.
      </Text>

      <Text style={styles.sectionTitle}>Licença e termos</Text>
      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          Linking.openURL('https://github.com/expo/expo').catch(() => {
            /* noop */
          })
        }
      >
        <Text style={styles.rowText}>Código aberto e dependências (exemplo)</Text>
        <Text style={styles.rowChevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          Linking.openURL('https://expo.dev/terms').catch(() => {
            /* noop */
          })
        }
      >
        <Text style={styles.rowText}>Termos de uso — referência Expo</Text>
        <Text style={styles.rowChevron}>›</Text>
      </TouchableOpacity>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  heroVersion: {
    marginTop: 8,
    fontSize: 15,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingRight: 12,
  },
  rowChevron: {
    fontSize: 22,
    color: '#ccc',
  },
});
