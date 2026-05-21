import { ProfileSubScreen } from '@/components/profile-sub-screen';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ServiceItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
};

const SERVICES: ServiceItem[] = [
  {
    id: 'home',
    title: 'Início',
    subtitle: 'Resumo do seu impacto e atalhos',
    icon: 'home-outline',
    href: '/(tabs)',
  },
  {
    id: 'scan',
    title: 'Escanear produto',
    subtitle: 'Código de barras e descarte correto',
    icon: 'barcode-outline',
    href: '/(tabs)/scan',
  },
  {
    id: 'rewards',
    title: 'Recompensas',
    subtitle: 'Pontos e benefícios',
    icon: 'gift-outline',
    href: '/(tabs)/rewards',
  },
  {
    id: 'disposal',
    title: 'Locais de descarte',
    subtitle: 'Encontre pontos próximos',
    icon: 'location-outline',
    href: '/(tabs)/disposal-points',
  },
  {
    id: 'recyclers',
    title: 'Recicladores',
    subtitle: 'Parceiros na sua região',
    icon: 'people-outline',
    href: '/(tabs)/recyclers',
  },
  {
    id: 'chat',
    title: 'Assistente',
    subtitle: 'Tire dúvidas sobre reciclagem',
    icon: 'chatbubble-outline',
    href: '/(tabs)/chat',
  },
];

export default function ServicesScreen() {
  const router = useRouter();

  return (
    <ProfileSubScreen title="Meus serviços">
      <Text style={styles.intro}>
        Toque em um serviço para abrir diretamente no EcoCycle.
      </Text>

      <View style={styles.list}>
        {SERVICES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() => {
              router.push(item.href);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={22} color="#4CAF50" />
            </View>
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>
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
  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});
