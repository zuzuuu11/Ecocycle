import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const router = useRouter();

  const handleMonthPress = (month: string) => {
    // Lógica para filtrar dados por mês
    console.log('Mês selecionado:', month);
  };

  const handleViewDetails = () => {
    router.push('/(tabs)/impact');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seu Progresso Mensal</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartLine} />
            <View style={styles.chartLine2} />
            <View style={styles.chartLine3} />
          </View>
        </View>

        <View style={styles.progressCircleContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercentage}>85%</Text>
          </View>
          <Text style={styles.progressText}>
            Você reduziu cerca de 85% do seu lixo esse mês
          </Text>
        </View>

        <View style={styles.monthSelector}>
          <TouchableOpacity 
            style={styles.monthButton}
            onPress={() => handleMonthPress('Janeiro')}
          >
            <Text style={styles.monthText}>Janeiro</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.monthButton, styles.monthButtonActive]}
            onPress={() => handleMonthPress('Fevereiro')}
          >
            <Text style={[styles.monthText, styles.monthTextActive]}>Fevereiro</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.monthButton}
            onPress={() => handleMonthPress('Março')}
          >
            <Text style={styles.monthText}>Março</Text>
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
  chartContainer: {
    marginVertical: 20,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
    padding: 20,
    position: 'relative',
  },
  chartLine: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  chartLine2: {
    position: 'absolute',
    bottom: 80,
    left: 60,
    width: 3,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  chartLine3: {
    position: 'absolute',
    bottom: 100,
    left: 120,
    width: 3,
    height: 70,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressCircleContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  monthButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  monthButtonActive: {
    backgroundColor: '#4CAF50',
  },
  monthText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  monthTextActive: {
    color: '#FFFFFF',
  },
});
