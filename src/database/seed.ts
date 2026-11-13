
import { getDatabase } from './connection';

export async function inserirDadosTeste(
  hashTeste: string
) {
  const db = await getDatabase();

  await db.withExclusiveTransactionAsync(async (tx) => {

    const servidores = [
      ['1001', 'João Silva', 'joao@ifpi.edu.br', 'servidor'],
      ['1002', 'Maria Santos', 'maria@ifpi.edu.br', 'servidor'],
      ['1003', 'Administrador TI', 'ti@ifpi.edu.br', 'ti']
    ];

    for (const servidor of servidores) {
      await tx.runAsync(
        `INSERT OR IGNORE INTO servidores
         (matricula, nome_completo, email,
          senha_hash, perfil, ativo)
         VALUES (?, ?, ?, ?, ?, 1)`,
        servidor[0],
        servidor[1],
        servidor[2],
        hashTeste,
        servidor[3]
      );
    }

    const chaves = [
      ['001', 'Sala dos Professores', 'QR-001'],
      ['015', 'Laboratório de Informática 01', 'QR-015'],
      ['021', 'Laboratório de Biologia', 'QR-021'],
      ['030', 'Biblioteca', 'QR-030'],
      ['045', 'Secretaria', 'QR-045']
    ];

    for (const chave of chaves) {
      await tx.runAsync(
        `INSERT OR IGNORE INTO chaves
         (numero, setor_laboratorio, qr_code)
         VALUES (?, ?, ?)`,
        chave[0],
        chave[1],
        chave[2]
      );
    }

  });
}
