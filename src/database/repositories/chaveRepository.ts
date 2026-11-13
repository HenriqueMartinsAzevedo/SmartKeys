
import { getDatabase } from '../connection';
import { Chave } from '../../types/Chave';

export async function cadastrarChave(chave: Chave) {
  const db = await getDatabase();

  const resultado = await db.runAsync(
    `INSERT INTO chaves
    (numero, setor_laboratorio, qr_code, status, ativo)
    VALUES (?, ?, ?, 'disponivel', 1)`,
    chave.numero,
    chave.setor_laboratorio,
    chave.qr_code
  );

  return resultado.lastInsertRowId;
}

export async function listarChaves() {
  const db = await getDatabase();

  return await db.getAllAsync(
    `SELECT
       chaves.*,
       servidores.nome_completo AS responsavel
     FROM chaves
     LEFT JOIN servidores
       ON chaves.responsavel_atual_id = servidores.id
     ORDER BY chaves.numero`
  );
}

export async function buscarChave(id: number) {
  const db = await getDatabase();

  return await db.getFirstAsync(
    'SELECT * FROM chaves WHERE id = ?',
    id
  );
}

export async function listarChavesDisponiveis() {
  const db = await getDatabase();

  return await db.getAllAsync(
    `SELECT * FROM chaves
     WHERE status = 'disponivel'
       AND ativo = 1`
  );
}
