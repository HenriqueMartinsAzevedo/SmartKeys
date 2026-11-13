
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QrCode from '../components/QrCode';
import { gerarIdentificadorQR } from '../services/qrcode';

export default function TesteIntegrante4() {
  const [codigo] = useState(() => gerarIdentificadorQR());

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Teste de QR Code</Text>

      <QrCode
        identificador={codigo}
        numeroChave="01"
        setor="Laboratório de Informática"
      />

      <Text style={styles.texto}>
        Se o QR Code apareceu, a geração está funcionando!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2F9E41',
    marginBottom: 25,
  },
  texto: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
