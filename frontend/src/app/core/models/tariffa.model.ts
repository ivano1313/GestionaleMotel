export interface Tariffa {
  id?: number;
  tipologiaId: number;
  tipologiaNome?: string;
  periodoId: number;
  periodoNome?: string;
  prezzoPerNotte: number;
}

export interface PeriodoTariffario {
  id?: number;
  nome: string;
  dataInizio: string;
  dataFine: string;
  attivo?: boolean;
}
