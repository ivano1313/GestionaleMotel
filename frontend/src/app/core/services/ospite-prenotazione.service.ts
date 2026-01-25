import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OspitePrenotazione, AddOspiteRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OspitePrenotazioneService {
  private readonly baseUrl = `${environment.apiUrl}/prenotazioni`;

  constructor(private http: HttpClient) {}

  getOspiti(prenotazioneId: number): Observable<OspitePrenotazione[]> {
    return this.http.get<OspitePrenotazione[]>(`${this.baseUrl}/${prenotazioneId}/ospiti`);
  }

  addOspite(prenotazioneId: number, request: AddOspiteRequest): Observable<OspitePrenotazione> {
    return this.http.post<OspitePrenotazione>(`${this.baseUrl}/${prenotazioneId}/ospiti`, request);
  }

  removeOspite(prenotazioneId: number, ospiteId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${prenotazioneId}/ospiti/${ospiteId}`);
  }

  setTitolare(prenotazioneId: number, ospiteId: number): Observable<OspitePrenotazione> {
    return this.http.patch<OspitePrenotazione>(
      `${this.baseUrl}/${prenotazioneId}/ospiti/${ospiteId}/titolare`,
      null
    );
  }
}
