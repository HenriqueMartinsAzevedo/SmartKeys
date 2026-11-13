
import * as Crypto from 'expo-crypto';

/**
 * Gera um identificador exclusivo para cada chave.
 * Esse identificador será armazenado no SQLite.
 */
export function gerarIdentificadorQR(): string {
  return Crypto.randomUUID();
}

/**
 * Verifica se o QR Code lido corresponde
 * ao identificador da chave selecionada.
 */
export function validarIdentificadorQR(
  codigoLido: string,
  codigoEsperado: string
): boolean {
  return codigoLido === codigoEsperado;
}
