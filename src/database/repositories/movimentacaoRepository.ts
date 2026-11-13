
import { getDatabase } from '../connection';

export async function retirarChave(
  chaveId: number,
  servidorId: number,
  qrLido: string
) {
  const db = await getDatabase();

  await db.withExclusiveTransactionAsync(async (tx) => {

    // Verificar servidor
    const servidor = await tx.getFirstAsync<{ ativo: number }>(
      `SELECT ativo FROM servidores
       WHERE id = ?`,
      servidorId
    );

    if (!servidor || servidor.ativo !== 1) {
      throw new Error('Servidor inexistente ou inativo.');
    }

    // Verificar chave e QR Code
    const chave = await tx.getFirstAsync<{
      status: string;
      qr_code: string;
    }>(
      `SELECT status, qr_code FROM chaves
       WHERE id = ? AND ativo = 1`,
      chaveId
    );

    if (!chave) {
      throw new Error('Chave não encontrada.');
    }

    if (chave.qr_code !== qrLido) {
      throw new Error('QR Code não corresponde à chave.');
    }

    if (chave.status !== 'disponivel') {
      throw new Error('Chave já está em uso.');
    }

    // Registrar retirada
    await tx.runAsync(
      `INSERT INTO movimentacoes
       (chave_id, tipo, servidor_executor_id, data_hora)
       VALUES (?, 'retirada', ?, ?)`,
      chaveId,
      servidorId,
      new Date().toISOString()
    );

    // Atualizar chave
    await tx.runAsync(
      `UPDATE chaves
       SET status = 'em_uso',
           responsavel_atual_id = ?
       WHERE id = ?`,
      servidorId,
      chaveId
    );

  });
}

export async function consultarHistorico(
  dataInicial: string,
  dataFinal: string
) {
  const db = await getDatabase();

  return await db.getAllAsync(
    `SELECT
       m.id,
       m.tipo,
       m.data_hora,
       c.numero AS numero_chave,
       c.setor_laboratorio,
       s.nome_completo AS servidor_executor,
       s.matricula,
       m.retirada_id,
       r.nome_completo AS servidor_retirada

     FROM movimentacoes m

     INNER JOIN chaves c
       ON m.chave_id = c.id

     INNER JOIN servidores s
       ON m.servidor_executor_id = s.id

     LEFT JOIN movimentacoes mr
       ON m.retirada_id = mr.id

     LEFT JOIN servidores r
       ON mr.servidor_executor_id = r.id

     WHERE m.data_hora >= ?
       AND m.data_hora <= ?

     ORDER BY m.data_hora ASC`,
    dataInicial,
    dataFinal
  );
}
