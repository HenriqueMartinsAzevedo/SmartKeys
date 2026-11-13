
export interface Movimentacao {
  id?: number;
  chave_id: number;
  tipo: 'retirada' | 'devolucao';
  servidor_executor_id: number;
  retirada_id: number | null;
  data_hora: string;
}
