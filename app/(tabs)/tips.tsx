import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TipsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dicas Sustentáveis</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Dicas Sustentáveis</Text>
          <Text style={styles.bannerSubtitle}>
            Aprenda a ser ainda mais sustentável com dicas práticas do EcoCycle
          </Text>
        </View>

        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bag-outline" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>Carregue sua Ecobag</Text>
            <Text style={styles.tipDescription}>
              Leve sempre sua sacola ecológica para evitar o uso de plásticos
            </Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="refresh" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>Prefira produtos reutilizáveis</Text>
            <Text style={styles.tipDescription}>
              Escolha itens que possam ser usados várias vezes em vez de descartáveis
            </Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="trash-outline" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>Evite produtos que prejudiquem o meio ambiente</Text>
            <Text style={styles.tipDescription}>
              Pesquise sobre os produtos antes de comprar e escolha opções sustentáveis
            </Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="water-outline" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>Economize água</Text>
            <Text style={styles.tipDescription}>
              Feche torneiras e tome banhos mais curtos para preservar recursos
            </Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb-outline" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>Use energia limpa</Text>
            <Text style={styles.tipDescription}>
              Apague luzes e desconecte aparelhos que não estão em uso
            </Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="leaf-outline" size={40} color="#4CAF50" />
            </View>
            <Text style={styles.tipTitle}>Plante árvores</Text>
            <Text style={styles.tipDescription}>
              Contribua para o reflorestamento e ajude a purificar o ar
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  banner: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 25,
    marginVertical: 20,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  tipsContainer: {
    paddingBottom: 20,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
