export interface CategoriaSpesa {
  id?: number;
  nome: string;
  descrizione?: string;
  attivo?: boolean;
}

export interface Spesa {
  id?: number;
  categoriaId: number;
  categoriaNome?: string;
  descrizione: string;
  importo: number;
  dataSpesa: string;
  note?: string;
  attivo?: boolean;
}
