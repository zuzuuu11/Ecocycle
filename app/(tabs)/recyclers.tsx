import type { RecyclerRow } from '@/lib/api';
import { apiGetRecyclers } from '@/lib/api';
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

function dial(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return;
  Linking.openURL(`tel:${digits}`).catch(() => {});
}

export default function RecyclersScreen() {
  const router = useRouter();
  const [rows, setRows] = useState<RecyclerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { ok, data } = await apiGetRecyclers();
        if (!cancelled && ok && data.recyclers) setRows(data.recyclers);
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
        <Text style={styles.headerTitle}>Recicladores</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#4CAF50" />
        ) : (
          rows.map((r) => (
            <View key={r.id} style={styles.recyclerCard}>
              <View style={styles.recyclerImage}>
                <Ionicons name="person" size={60} color="#4CAF50" />
              </View>
              <View style={styles.recyclerInfo}>
                <Text style={styles.recyclerTitle}>{r.title}</Text>
                <Text style={styles.recyclerSubtitle}>{r.subtitle}</Text>
                <View style={styles.locationInfo}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.address}>{r.address}</Text>
                </View>
                <TouchableOpacity style={styles.phoneButton} onPress={() => dial(r.phone)}>
                  <Ionicons name="call-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.phoneNumber}>{r.phone}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
    paddingTop: 10,
  },
  recyclerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recyclerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recyclerInfo: {
    flex: 1,
  },
  recyclerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recyclerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    flex: 1,
  },
  phoneButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  phoneNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
