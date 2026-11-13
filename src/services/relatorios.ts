
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export interface MovimentacaoRelatorio {
  numeroChave: string;
  setor: string;
  tipo: 'Retirada' | 'Devolução';
  dataHora: string;
  nomeExecutor: string;
  matriculaExecutor: string;
  nomeResponsavelRetirada?: string;
}

function escaparHTML(valor: string): string {
  return valor.replace(/[&<>"']/g, (caractere) => {
    const entidades: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entidades[caractere];
  });
}

export async function gerarRelatorioPDF(
  movimentacoes: MovimentacaoRelatorio[],
  dataInicio: string,
  dataFim: string
) {
  const totalRetiradas = movimentacoes.filter(
    (item) => item.tipo === 'Retirada'
  ).length;

  const totalDevolucoes = movimentacoes.filter(
    (item) => item.tipo === 'Devolução'
  ).length;

  const linhas = movimentacoes.map((item) => `
    <tr>
      <td>${escaparHTML(item.numeroChave)}</td>
      <td>${escaparHTML(item.setor)}</td>
      <td>${escaparHTML(item.tipo)}</td>
      <td>${escaparHTML(item.dataHora)}</td>
      <td>
        ${escaparHTML(item.nomeExecutor)}
        (${escaparHTML(item.matriculaExecutor)})
      </td>
      <td>
        ${item.tipo === 'Devolução'
          ? escaparHTML(item.nomeResponsavelRetirada || 'Não informado')
          : '-'}
      </td>
    </tr>
  `).join('');

  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #000; }
          h1 { color: #2F9E41; text-align: center; }
          .cabecalho { text-align: center; margin-bottom: 24px; }
          .resumo { margin: 20px 0; padding: 12px; border: 1px solid #2F9E41; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th { background: #2F9E41; color: white; }
          th, td { border: 1px solid #ccc; padding: 7px; text-align: left; }
          tr { page-break-inside: avoid; }
          .vazio { text-align: center; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="cabecalho">
          <h1>IFPI - Campus Pedro II</h1>
          <h2>Relatório de Controle de Chaves</h2>
          <p>Período: ${escaparHTML(dataInicio)} até ${escaparHTML(dataFim)}</p>
          <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        </div>

        <div class="resumo">
          <strong>Total de movimentações:</strong> ${movimentacoes.length}<br/>
          <strong>Retiradas:</strong> ${totalRetiradas}<br/>
          <strong>Devoluções:</strong> ${totalDevolucoes}
        </div>

        ${movimentacoes.length === 0
          ? '<p class="vazio">Não foram encontradas movimentações no período selecionado.</p>'
          : `
            <table>
              <thead>
                <tr>
                  <th>Chave</th>
                  <th>Setor</th>
                  <th>Operação</th>
                  <th>Data e hora</th>
                  <th>Servidor executor</th>
                  <th>Responsável pela retirada</th>
                </tr>
              </thead>
              <tbody>${linhas}</tbody>
            </table>
          `}
      </body>
    </html>
  `;

  const arquivo = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(arquivo.uri);
  }

  return arquivo.uri;
}
