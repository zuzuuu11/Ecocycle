import { ProfileSubScreen } from '@/components/profile-sub-screen';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SecurityScreen() {
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTips, setSessionTips] = useState(true);

  return (
    <ProfileSubScreen title="Central de segurança">
      <Text style={styles.intro}>
        Gerencie alertas e boas práticas para manter sua conta protegida.
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Alertas de novo acesso</Text>
            <Text style={styles.rowSubtitle}>
              Aviso quando detectarmos um novo dispositivo (simulado neste app).
            </Text>
          </View>
          <Switch
            value={loginAlerts}
            onValueChange={setLoginAlerts}
            trackColor={{ false: '#ccc', true: '#C8E6C9' }}
            thumbColor={loginAlerts ? '#4CAF50' : '#f4f3f4'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Dicas de segurança no app</Text>
            <Text style={styles.rowSubtitle}>
              Mostrar lembretes sobre senha forte e links suspeitos.
            </Text>
          </View>
          <Switch
            value={sessionTips}
            onValueChange={setSessionTips}
            trackColor={{ false: '#ccc', true: '#C8E6C9' }}
            thumbColor={sessionTips ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Senha</Text>
      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() =>
          Alert.alert(
            'Alterar senha',
            'Em uma versão com servidor, você receberia um e-mail para redefinir a senha. Por enquanto, use a tela de login do app.'
          )
        }
      >
        <Text style={styles.outlineButtonText}>Solicitar redefinição de senha</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Dispositivos</Text>
      <View style={styles.card}>
        <Text style={styles.deviceLine}>Este dispositivo — sessão ativa</Text>
        <Text style={styles.deviceHint}>
          Encerrar outras sessões estará disponível quando houver backend de autenticação.
        </Text>
      </View>
    </ProfileSubScreen>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#9C27B0',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  outlineButtonText: {
    color: '#9C27B0',
    fontWeight: '600',
    fontSize: 15,
  },
  deviceLine: {
    fontSize: 15,
    color: '#333',
  },
  deviceHint: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
    lineHeight: 18,
  },
});
