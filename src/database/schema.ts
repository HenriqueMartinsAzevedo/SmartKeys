
import { getDatabase } from './connection';

export async function criarTabelas() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS servidores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matricula TEXT NOT NULL UNIQUE,
      nome_completo TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT,
      senha_hash TEXT NOT NULL,
      perfil TEXT NOT NULL DEFAULT 'servidor'
        CHECK (perfil IN ('servidor', 'ti')),
      ativo INTEGER NOT NULL DEFAULT 1
        CHECK (ativo IN (0, 1))
    );

    CREATE TABLE IF NOT EXISTS chaves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT NOT NULL UNIQUE,
      setor_laboratorio TEXT NOT NULL,
      qr_code TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'disponivel'
        CHECK (status IN ('disponivel', 'em_uso')),
      responsavel_atual_id INTEGER,
      ativo INTEGER NOT NULL DEFAULT 1
        CHECK (ativo IN (0, 1)),

      FOREIGN KEY (responsavel_atual_id)
        REFERENCES servidores(id)
        ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chave_id INTEGER NOT NULL,
      tipo TEXT NOT NULL
        CHECK (tipo IN ('retirada', 'devolucao')),
      servidor_executor_id INTEGER NOT NULL,
      retirada_id INTEGER,
      data_hora TEXT NOT NULL,

      FOREIGN KEY (chave_id)
        REFERENCES chaves(id)
        ON DELETE RESTRICT,

      FOREIGN KEY (servidor_executor_id)
        REFERENCES servidores(id)
        ON DELETE RESTRICT,

      FOREIGN KEY (retirada_id)
        REFERENCES movimentacoes(id)
        ON DELETE RESTRICT,

      CHECK (
        (tipo = 'retirada' AND retirada_id IS NULL)
        OR
        (tipo = 'devolucao' AND retirada_id IS NOT NULL)
      ),

      UNIQUE (retirada_id)
    );


-- Impede duas retiradas abertas para a mesma chave
CREATE TRIGGER IF NOT EXISTS impedir_retirada_duplicada
BEFORE INSERT ON movimentacoes
WHEN NEW.tipo = 'retirada'
BEGIN
  SELECT CASE
    WHEN EXISTS (
      SELECT 1
      FROM movimentacoes r
      WHERE r.chave_id = NEW.chave_id
        AND r.tipo = 'retirada'
        AND NOT EXISTS (
          SELECT 1
          FROM movimentacoes d
          WHERE d.retirada_id = r.id
            AND d.tipo = 'devolucao'
        )
    )
    THEN RAISE(ABORT, 'Chave ja possui retirada aberta')
  END;
END;

-- Impede devolução sem retirada correspondente
CREATE TRIGGER IF NOT EXISTS validar_devolucao
BEFORE INSERT ON movimentacoes
WHEN NEW.tipo = 'devolucao'
BEGIN
  SELECT CASE
    WHEN NOT EXISTS (
      SELECT 1
      FROM movimentacoes r
      WHERE r.id = NEW.retirada_id
        AND r.chave_id = NEW.chave_id
        AND r.tipo = 'retirada'
        AND NOT EXISTS (
          SELECT 1
          FROM movimentacoes d
          WHERE d.retirada_id = r.id
        )
    )
    THEN RAISE(ABORT, 'Retirada invalida ou ja devolvida')
    END;
    END;

    -- Impede alteração do histórico
    CREATE TRIGGER IF NOT EXISTS proteger_historico_update
    BEFORE UPDATE ON movimentacoes
    BEGIN
    SELECT RAISE(ABORT, 'Historico nao pode ser alterado');
    END;

    -- Impede exclusão do histórico
    CREATE TRIGGER IF NOT EXISTS proteger_historico_delete
    BEFORE DELETE ON movimentacoes
    BEGIN
    SELECT RAISE(ABORT, 'Historico nao pode ser excluido');
    END;

  `);
  
}

