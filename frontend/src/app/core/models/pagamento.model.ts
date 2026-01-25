export interface Pagamento {
  id?: number;
  prenotazioneId: number;
  metodoPagamentoId: number;
  metodoPagamentoNome?: string;
  importo: number;
  dataPagamento?: string;
  note?: string;
}

export interface MetodoPagamento {
  id?: number;
  nome: string;
  attivo?: boolean;
}
