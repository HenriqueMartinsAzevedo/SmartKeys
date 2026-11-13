
export interface Servidor {
  id?: number;
  matricula: string;
  nome_completo: string;
  email: string;
  telefone?: string | null;
  senha_hash: string;
  perfil: 'servidor' | 'ti';
  ativo: number;
}
