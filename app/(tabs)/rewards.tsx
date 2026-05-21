import { useAuth } from '@/contexts/auth-context';
import type { RewardTier } from '@/lib/api';
import { apiGetRewards } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function tierIcon(name?: string): keyof typeof Ionicons.glyphMap {
  if (name === 'ticket') return 'ticket-outline';
  if (name === 'bag') return 'bag-outline';
  if (name === 'leaf') return 'leaf-outline';
  return 'gift-outline';
}

export default function RewardsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(user?.points ?? 0);
  const [goal, setGoal] = useState(user?.pointsGoal ?? 8900);
  const [tiers, setTiers] = useState<RewardTier[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { ok, data } = await apiGetRewards();
      if (ok && data.tiers) {
        setPoints(data.points);
        setGoal(data.pointsGoal);
        setTiers(data.tiers);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const progressMain = goal > 0 ? Math.min(1, points / goal) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recompensas</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.rewardsButton} onPress={load}>
            <Ionicons name="gift" size={40} color="#4CAF50" />
            <Text style={styles.rewardsButtonText}>Atualizar recompensas</Text>
          </TouchableOpacity>

          <View style={styles.pointsSection}>
            <Text style={styles.sectionTitle}>Seus pontos</Text>
            <View style={styles.pointsCard}>
              <Text style={styles.pointsValue}>
                {points.toLocaleString('pt-BR')}/{goal.toLocaleString('pt-BR')}
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressMain * 100}%` }]} />
              </View>
            </View>
          </View>

          <View style={styles.rewardItems}>
            {tiers.map((tier) => {
              const pct = tier.goal > 0 ? Math.min(100, Math.round((tier.current / tier.goal) * 100)) : 0;
              return (
                <View key={tier.id} style={styles.rewardCard}>
                  <View style={styles.rewardInfo}>
                    {tier.discountLabel ? (
                      <Text style={styles.discount}>{tier.discountLabel}</Text>
                    ) : (
                      <Ionicons name={tierIcon(tier.icon)} size={24} color="#9C27B0" />
                    )}
                    <Text style={styles.rewardTitle}>{tier.title}</Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.pointsText}>
                      {tier.current.toLocaleString('pt-BR')}/
                      {tier.goal.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rewardsButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 25,
    marginVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rewardsButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  pointsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  pointsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  rewardItems: {
    marginBottom: 20,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardInfo: {
    flex: 1,
  },
  discount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 5,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
