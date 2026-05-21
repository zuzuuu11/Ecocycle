import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function formatInt(n: number) {
  return Math.round(n).toLocaleString('pt-BR');
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const impact = user?.impactKgCo2 ?? 0;
  const points = user?.points ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>EcoCycle</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => refreshUser()} hitSlop={12}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} hitSlop={12}>
            <Ionicons name="person-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>Seu impacto ambiental</Text>
          <Text style={styles.impactValue}>{formatInt(impact)} kg de CO₂</Text>
          <Text style={styles.impactSubtitle}>impacto evitado (estimativa)</Text>
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={() => router.push('/(tabs)/scan')}>
          <Ionicons name="barcode-outline" size={40} color="#4CAF50" />
          <Text style={styles.scanButtonText}>Escanear Produto</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locais de descarte</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/(tabs)/disposal-points')}
          >
            <Ionicons name="location-outline" size={24} color="#9C27B0" />
            <Text style={styles.cardText}>Encontrar pontos próximos</Text>
            <Ionicons name="chevron-forward" size={20} color="#9C27B0" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recicladores próximos</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/(tabs)/recyclers')}
          >
            <Ionicons name="refresh" size={24} color="#9C27B0" />
            <Text style={styles.cardText}>Ver recicladores</Text>
            <Ionicons name="chevron-forward" size={20} color="#9C27B0" />
          </TouchableOpacity>
        </View>

        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>Junte pontos e ganhe recompensas</Text>
          <TouchableOpacity
            style={styles.rewardsCard}
            onPress={() => router.push('/(tabs)/rewards')}
          >
            <Ionicons name="gift-outline" size={30} color="#FF9800" />
            <View style={styles.rewardsContent}>
              <Text style={styles.rewardsTitle}>Recompensas</Text>
              <Text style={styles.rewardsSubtitle}>
                {formatInt(points)} pontos disponíveis
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FF9800" />
          </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  impactCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 25,
    marginVertical: 20,
    alignItems: 'center',
  },
  impactTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  impactValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  impactSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  scanButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  rewardsSection: {
    marginBottom: 20,
  },
  rewardsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardsContent: {
    flex: 1,
    marginLeft: 15,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rewardsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
