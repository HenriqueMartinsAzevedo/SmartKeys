
import { criarTabelas } from './schema';

export async function inicializarBanco() {
  await criarTabelas();
}
