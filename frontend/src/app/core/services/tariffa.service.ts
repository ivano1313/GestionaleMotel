import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tariffa } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TariffaService {
  private readonly baseUrl = `${environment.apiUrl}/tariffe`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tariffa[]> {
    return this.http.get<Tariffa[]>(this.baseUrl);
  }

  getById(id: number): Observable<Tariffa> {
    return this.http.get<Tariffa>(`${this.baseUrl}/${id}`);
  }

  cerca(tipologiaId: number, periodoId: number): Observable<Tariffa> {
    const params = new HttpParams()
      .set('tipologiaId', tipologiaId.toString())
      .set('periodoId', periodoId.toString());
    return this.http.get<Tariffa>(`${this.baseUrl}/cerca`, { params });
  }

  calcolaPrezzo(tipologiaId: number, checkIn: string, checkOut: string): Observable<number> {
    const params = new HttpParams()
      .set('tipologiaId', tipologiaId.toString())
      .set('checkIn', checkIn)
      .set('checkOut', checkOut);
    return this.http.get<number>(`${this.baseUrl}/calcola-prezzo`, { params });
  }

  create(tariffa: Tariffa): Observable<Tariffa> {
    return this.http.post<Tariffa>(this.baseUrl, tariffa);
  }

  update(id: number, tariffa: Tariffa): Observable<Tariffa> {
    return this.http.put<Tariffa>(`${this.baseUrl}/${id}`, tariffa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
