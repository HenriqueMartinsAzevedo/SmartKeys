
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface LeitorQRProps {
  codigoEsperado: string;
  onValidado: (codigoLido: string) => void;
}

export default function LeitorQR({
  codigoEsperado,
  onValidado,
}: LeitorQRProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [leituraRealizada, setLeituraRealizada] = useState(false);
  const [mensagem, setMensagem] = useState('Aponte a câmera para o QR Code.');

  if (!permission) {
    return <Text>Verificando permissão da câmera...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>
          Precisamos de acesso à câmera para ler o QR Code.
        </Text>
        <Button title="Permitir câmera" onPress={requestPermission} />
      </View>
    );
  }

  function lerQR({ data }: { data: string }) {
    if (leituraRealizada) return;

    setLeituraRealizada(true);

    if (data === codigoEsperado) {
      setMensagem('QR Code correto! Chave validada.');
      onValidado(data);
    } else {
      setMensagem('QR Code incorreto! Selecione o QR Code da chave correta.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Leitura do QR Code</Text>

      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={leituraRealizada ? undefined : lerQR}
      />

      <Text style={styles.texto}>{mensagem}</Text>

      {leituraRealizada && (
        <Button
          title="Tentar novamente"
          onPress={() => {
            setLeituraRealizada(false);
            setMensagem('Aponte a câmera para o QR Code.');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F9E41',
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: 350,
    borderRadius: 12,
    overflow: 'hidden',
  },
  texto: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginVertical: 20,
  },
});
