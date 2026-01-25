import { Prenotazione } from './prenotazione.model';

export interface Dashboard {
  arriviOggi: number;
  partenzeOggi: number;
  camereOccupate: number;
  camereDisponibili: number;
  camereDaPulire: number;
  incassiOggi: number;
  arriviDelGiorno: Prenotazione[];
  partenzeDelGiorno: Prenotazione[];
}

export interface Planning {
  dataDa: string;
  dataA: string;
  giorni: PlanningGiorno[];
}

export interface PlanningGiorno {
  data: string;
  arriviPrevisti: number;
  partenzePreviste: number;
  camereOccupate: number;
  prenotazioni: Prenotazione[];
}
