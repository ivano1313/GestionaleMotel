import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Prenotazione, StatoPrenotazione } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {
  private readonly baseUrl = `${environment.apiUrl}/prenotazioni`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(this.baseUrl);
  }

  getById(id: number): Observable<Prenotazione> {
    return this.http.get<Prenotazione>(`${this.baseUrl}/${id}`);
  }

  getArriviOggi(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/arrivi-oggi`);
  }

  getPartenzeOggi(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/partenze-oggi`);
  }

  getAttive(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/attive`);
  }

  getSaldoDovuto(id: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${id}/saldo-dovuto`);
  }

  verificaDisponibilita(cameraId: number, checkIn: string, checkOut: string): Observable<boolean> {
    const params = new HttpParams()
      .set('cameraId', cameraId.toString())
      .set('checkIn', checkIn)
      .set('checkOut', checkOut);
    return this.http.get<boolean>(`${this.baseUrl}/verifica-disponibilita`, { params });
  }

  create(prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(this.baseUrl, prenotazione);
  }

  update(id: number, prenotazione: Prenotazione): Observable<Prenotazione> {
    return this.http.put<Prenotazione>(`${this.baseUrl}/${id}`, prenotazione);
  }

  cambiaStato(id: number, stato: StatoPrenotazione): Observable<Prenotazione> {
    const params = new HttpParams().set('stato', stato);
    return this.http.patch<Prenotazione>(`${this.baseUrl}/${id}/stato`, null, { params });
  }
}
