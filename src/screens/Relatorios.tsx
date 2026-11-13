
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

import { gerarRelatorioPDF, MovimentacaoRelatorio } from '../services/relatorios';

interface RelatoriosProps {
  movimentacoes?: MovimentacaoRelatorio[];
  podeGerarRelatorio: boolean;
}

export default function Relatorios({
  movimentacoes = [],
  podeGerarRelatorio,
}: RelatoriosProps) {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [gerando, setGerando] = useState(false);

  async function gerarPDF() {
    if (!dataInicio.trim() || !dataFim.trim()) {
      Alert.alert('Atenção', 'Informe a data inicial e a data final.');
      return;
    }

    if (!podeGerarRelatorio) {
      Alert.alert(
        'Acesso negado',
        'Somente usuários da equipe de TI podem gerar relatórios.'
      );
      return;
    }

    setGerando(true);

    try {
      await gerarRelatorioPDF(movimentacoes, dataInicio, dataFim);
      Alert.alert('Sucesso', 'Relatório gerado.');
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
      console.error(erro);
    } finally {
      setGerando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Relatórios de Movimentação</Text>

      <Text style={styles.label}>Data inicial</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        value={dataInicio}
        onChangeText={setDataInicio}
      />

      <Text style={styles.label}>Data final</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        value={dataFim}
        onChangeText={setDataFim}
      />

      <Button
        title={gerando ? 'Gerando relatório...' : 'Gerar PDF'}
        onPress={gerarPDF}
        disabled={gerando}
        color="#2F9E41"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F9E41',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2F9E41',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
  },
});
