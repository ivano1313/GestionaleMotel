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

export interface UscitaPerCategoria {
  categoriaId: number;
  categoriaNome: string;
  totale: number;
  numeroSpese: number;
}

export interface Bilancio {
  dataDa: string;
  dataA: string;
  totaleEntrate: number;
  totaleUscite: number;
  saldo: number;
  entratePerMetodo: IncassoPerMetodo[];
  uscitePerCategoria: UscitaPerCategoria[];
}
