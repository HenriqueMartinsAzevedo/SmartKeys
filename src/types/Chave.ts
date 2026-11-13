
export interface Chave {
  id?: number;
  numero: string;
  setor_laboratorio: string;
  qr_code: string;
  status: 'disponivel' | 'em_uso';
  responsavel_atual_id: number | null;
  ativo: number;
}
