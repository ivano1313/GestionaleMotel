import { StatoPrenotazione } from './enums';

export interface Prenotazione {
  id?: number;
  cameraId: number;
  cameraNumero?: string;
  dataCheckin: string;
  dataCheckout: string;
  stato?: StatoPrenotazione;
  prezzoTotale?: number;
  note?: string;
  nominativoTitolare?: string;
}
