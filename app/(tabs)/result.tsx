import { Product, findProductByBarcode } from '@/constants/products';
import { useAuth } from '@/contexts/auth-context';
import { apiGetProduct } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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

export default function ResultScreen() {
  const router = useRouter();
  const { barcode: barcodeParam } = useLocalSearchParams<{ barcode: string }>();
  const barcode = Array.isArray(barcodeParam) ? barcodeParam[0] : barcodeParam;
  const { recordProductScan } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!!barcode);
  const scanRecorded = useRef(false);

  useEffect(() => {
    if (!barcode) {
      setProduct(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    scanRecorded.current = false;
    setLoading(true);
    (async () => {
      try {
        const { ok, data } = await apiGetProduct(barcode);
        if (cancelled) return;
        const fromApi = ok && data.product ? (data.product as Product) : null;
        const p = fromApi ?? findProductByBarcode(barcode);
        setProduct(p);
        if (p && !scanRecorded.current) {
          scanRecorded.current = true;
          await recordProductScan(barcode);
        }
      } catch {
        if (!cancelled) {
          const p = findProductByBarcode(barcode);
          setProduct(p);
          if (p && !scanRecorded.current) {
            scanRecorded.current = true;
            await recordProductScan(barcode);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [barcode, recordProductScan]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resultado</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Carregando produto…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resultado</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF9800" />
          <Text style={styles.notFoundTitle}>Produto não encontrado</Text>
          <Text style={styles.notFoundText}>
            Este código de barras não está em nosso banco de dados.
          </Text>
          <TouchableOpacity 
            style={styles.scanAgainButton}
            onPress={() => router.back()}
          >
            <Text style={styles.scanAgainText}>Escanear novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="earth-outline" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Impactos Ambientais da Produção</Text>
          </View>
          <View style={styles.impactGrid}>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>{product.environmentalImpact.co2}g</Text>
              <Text style={styles.impactLabel}>CO₂</Text>
            </View>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>{product.environmentalImpact.water}L</Text>
              <Text style={styles.impactLabel}>Água</Text>
            </View>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>{product.environmentalImpact.energy}kWh</Text>
              <Text style={styles.impactLabel}>Energia</Text>
            </View>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>{product.environmentalImpact.waste}g</Text>
              <Text style={styles.impactLabel}>Resíduo</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf-outline" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Sustentabilidade e Alternativas</Text>
          </View>
          <View style={styles.sustainabilityBadges}>
            {product.sustainability.recyclable && (
              <View style={styles.badge}>
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={styles.badgeText}>Reciclável</Text>
              </View>
            )}
            {product.sustainability.biodegradable && (
              <View style={styles.badge}>
                <Ionicons name="leaf" size={16} color="#FFFFFF" />
                <Text style={styles.badgeText}>Biodegradável</Text>
              </View>
            )}
            {product.sustainability.sustainableMaterials && (
              <View style={styles.badge}>
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                <Text style={styles.badgeText}>Materiais Sustentáveis</Text>
              </View>
            )}
          </View>
          <View style={styles.alternativesContainer}>
            <Text style={styles.alternativesTitle}>Alternativas:</Text>
            {product.alternatives.map((alternative, index) => (
              <Text key={index} style={styles.alternativeItem}>• {alternative}</Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Principais Benefícios e Usos</Text>
          </View>
          {product.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trash-outline" size={24} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Descarte Correto</Text>
          </View>
          <View style={styles.disposalCard}>
            <View style={styles.disposalMethod}>
              <Text style={styles.disposalLabel}>Método:</Text>
              <Text style={styles.disposalValue}>{product.disposal.method}</Text>
            </View>
            <View style={styles.disposalLocation}>
              <Text style={styles.disposalLabel}>Local:</Text>
              <Text style={styles.disposalValue}>{product.disposal.location}</Text>
            </View>
            <View style={styles.disposalInstructions}>
              <Text style={styles.disposalLabel}>Instruções:</Text>
              <Text style={styles.disposalText}>{product.disposal.specialInstructions}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.learnMoreButton}
          onPress={() => router.push('/(tabs)/impact')}
        >
          <Text style={styles.learnMoreText}>Aprofundar mais...</Text>
        </TouchableOpacity>
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
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  scanAgainButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginTop: 30,
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactItem: {
    alignItems: 'center',
    flex: 1,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  impactLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  sustainabilityBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  badge: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  alternativesContainer: {
    marginTop: 15,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  alternativeItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  disposalCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
  },
  disposalMethod: {
    marginBottom: 10,
  },
  disposalLocation: {
    marginBottom: 10,
  },
  disposalInstructions: {
    marginBottom: 0,
  },
  disposalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  disposalValue: {
    fontSize: 14,
    color: '#666',
  },
  disposalText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  learnMoreButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  learnMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
