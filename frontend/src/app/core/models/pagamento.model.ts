import { TipoPagamento } from './enums';

export interface Pagamento {
  id?: number;
  prenotazioneId: number;
  metodoPagamentoId: number;
  metodoPagamentoNome?: string;
  importo: number;
  dataPagamento?: string;
  tipoPagamento?: TipoPagamento;
}

export interface MetodoPagamento {
  id?: number;
  nome: string;
  attivo?: boolean;
}
