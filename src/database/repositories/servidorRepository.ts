
import { getDatabase } from '../connection';
import { Servidor } from '../../types/Servidor';

export async function cadastrarServidor(
  servidor: Servidor
) {
  const db = await getDatabase();

  const resultado = await db.runAsync(
    `INSERT INTO servidores
    (matricula, nome_completo, email, telefone,
     senha_hash, perfil, ativo)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    servidor.matricula,
    servidor.nome_completo,
    servidor.email,
    servidor.telefone ?? null,
    servidor.senha_hash,
    servidor.perfil,
    servidor.ativo
  );

  return resultado.lastInsertRowId;
}

export async function listarServidores() {
  const db = await getDatabase();

  return await db.getAllAsync(
    `SELECT id, matricula, nome_completo,
            email, telefone, perfil, ativo
     FROM servidores
     ORDER BY nome_completo`
  );
}

export async function buscarServidor(id: number) {
  const db = await getDatabase();

  return await db.getFirstAsync(
    `SELECT id, matricula, nome_completo,
            email, telefone, perfil, ativo
     FROM servidores
     WHERE id = ?`,
    id
  );
}

export async function atualizarServidor(
  id: number,
  nome: string,
  email: string,
  telefone: string
) {
  const db = await getDatabase();

  return await db.runAsync(
    `UPDATE servidores
     SET nome_completo = ?,
         email = ?,
         telefone = ?
     WHERE id = ?`,
    nome,
    email,
    telefone,
    id
  );

  
}
