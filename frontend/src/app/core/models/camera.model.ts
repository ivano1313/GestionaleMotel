import { StatoPulizia } from './enums';

export interface Camera {
  id?: number;
  numero: string;
  statoPulizia?: StatoPulizia;
  tipologiaId: number;
  tipologiaNome?: string;
}

export interface TipologiaCamera {
  id?: number;
  nome: string;
  capienzaMassima: number;
  descrizione?: string;
  attivo?: boolean;
}
