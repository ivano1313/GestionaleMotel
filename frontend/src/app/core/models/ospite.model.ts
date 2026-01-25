import { Sesso } from './enums';

export interface Ospite {
  id?: number;
  cognome: string;
  nome: string;
  sesso: Sesso;
  dataNascita: string;
  comuneNascitaId?: number;
  comuneNascitaNome?: string;
  statoNascitaId?: number;
  statoNascitaNome?: string;
  cittadinanzaId: number;
  cittadinanzaNome?: string;
  tipoDocumentoId: number;
  tipoDocumentoSigla?: string;
  numeroDocumento: string;
  comuneRilascioId?: number;
  comuneRilascioNome?: string;
  statoRilascioId?: number;
  statoRilascioNome?: string;
  telefono?: string;
  email?: string;
}

export interface OspitePrenotazione {
  id?: number;
  prenotazioneId?: number;
  ospiteId?: number;
  ospiteNome?: string;
  ospiteCognome?: string;
  titolare?: boolean;
}

export interface AddOspiteRequest {
  ospiteId: number;
  titolare?: boolean;
}
