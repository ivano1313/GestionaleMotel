import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipologiaCamera } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TipologiaCameraService {
  private readonly baseUrl = `${environment.apiUrl}/tipologie`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipologiaCamera[]> {
    return this.http.get<TipologiaCamera[]>(this.baseUrl);
  }

  getById(id: number): Observable<TipologiaCamera> {
    return this.http.get<TipologiaCamera>(`${this.baseUrl}/${id}`);
  }

  create(tipologia: TipologiaCamera): Observable<TipologiaCamera> {
    return this.http.post<TipologiaCamera>(this.baseUrl, tipologia);
  }

  update(id: number, tipologia: TipologiaCamera): Observable<TipologiaCamera> {
    return this.http.put<TipologiaCamera>(`${this.baseUrl}/${id}`, tipologia);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
