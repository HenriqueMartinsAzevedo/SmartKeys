
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QrCodeProps {
  identificador: string;
  numeroChave: string;
  setor: string;
}

export default function QrCode({
  identificador,
  numeroChave,
  setor,
}: QrCodeProps) {
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        IFPI - Campus Pedro II
      </Text>

      <Text style={styles.chave}>
        Chave {numeroChave}
      </Text>

      <Text style={styles.setor}>
        {setor}
      </Text>

      <QRCode
        value={identificador}
        size={200}
        color="#000000"
        backgroundColor="#FFFFFF"
      />

      <Text style={styles.identificador}>
        Código: {identificador}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2F9E41',
  },

  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2F9E41',
    marginBottom: 12,
  },

  chave: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },

  setor: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 15,
  },

  identificador: {
    fontSize: 10,
    color: '#000000',
    marginTop: 12,
  },
});
