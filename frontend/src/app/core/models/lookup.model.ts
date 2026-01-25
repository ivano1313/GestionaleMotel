export interface Comune {
  id: number;
  codice: string;
  nome: string;
  provincia: string;
}

export interface Stato {
  id: number;
  codice: string;
  nome: string;
}

export interface TipoDocumento {
  id: number;
  sigla: string;
  descrizione: string;
  attivo?: boolean;
}
