export interface IncassoPerMetodo {
  metodoId: number;
  metodoNome: string;
  totale: number;
  numeroPagamenti: number;
}

export interface PagamentoReport {
  id: number;
  data: string;
  importo: number;
  metodo: string;
  camera: string;
}

export interface ReportIncassi {
  dataDa: string;
  dataA: string;
  totaleIncassi: number;
  incassiPerMetodo: IncassoPerMetodo[];
  pagamenti: PagamentoReport[];
}
