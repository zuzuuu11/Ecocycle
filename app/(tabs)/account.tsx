import { ProfileSubScreen } from '@/components/profile-sub-screen';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AccountScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) setDisplayName(user.displayName);
  }, [user]);

  if (!user) {
    return null;
  }

  const onSave = async () => {
    const { error } = await updateProfile({ displayName });
    if (error) {
      Alert.alert('Erro', error);
      return;
    }
    Alert.alert('Conta atualizada', 'Os dados foram guardados no servidor.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ProfileSubScreen title="Minha conta">
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Como devemos chamar você?"
        placeholderTextColor="#9E9E9E"
      />

      <Text style={[styles.label, styles.labelSpaced]}>E-mail</Text>
      <View style={styles.readonlyBox}>
        <Text style={styles.readonlyText}>{user.email}</Text>
      </View>
      <Text style={styles.hint}>
        O e-mail está vinculado ao login e não pode ser alterado nesta versão do app.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
        <Text style={styles.primaryButtonText}>Salvar alterações</Text>
      </TouchableOpacity>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  labelSpaced: {
    marginTop: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  readonlyBox: {
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  readonlyText: {
    fontSize: 16,
    color: '#666',
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 28,
    backgroundColor: '#9C27B0',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
