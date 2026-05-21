import type { DisposalPartner } from '@/lib/api';
import { apiGetDisposalPartners } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function openMapsForPartner(name: string) {
  const q = encodeURIComponent(`${name} reciclagem descarte`);
  const url = `https://www.google.com/maps/search/?api=1&query=${q}`;
  Linking.openURL(url).catch(() => {});
}

export default function DisposalPointsScreen() {
  const router = useRouter();
  const [partners, setPartners] = useState<DisposalPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { ok, data } = await apiGetDisposalPartners();
        if (!cancelled && ok && data.partners) setPartners(data.partners);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pontos de descarte</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={60} color="#9C27B0" />
            <Text style={styles.mapText}>Parceiros EcoCycle</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.navigationButton}
          onPress={() => openMapsForPartner('ecoponto reciclagem')}
        >
          <Ionicons name="navigate-outline" size={24} color="#FFFFFF" />
          <Text style={styles.navigationButtonText}>Abrir mapas</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empresas parceiras</Text>
          {loading ? (
            <ActivityIndicator style={{ marginVertical: 24 }} color="#4CAF50" />
          ) : (
            partners.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.partnerCard}
                onPress={() => openMapsForPartner(p.name)}
                activeOpacity={0.8}
              >
                <View style={styles.partnerInfo}>
                  <Text style={styles.partnerName}>{p.name}</Text>
                  <Text style={styles.partnerDistance}>{p.distanceKm} km</Text>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{p.reviewCount} avaliações</Text>
                  </View>
                  <Text style={styles.collectionTime}>Coleta: {p.collectionTime}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#9C27B0" />
              </TouchableOpacity>
            ))
          )}
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
  mapContainer: {
    marginVertical: 20,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 10,
    fontWeight: 'bold',
  },
  navigationButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 25,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  partnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  partnerDistance: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  collectionTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
