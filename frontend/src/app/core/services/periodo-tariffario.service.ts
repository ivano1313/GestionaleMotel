import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PeriodoTariffario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PeriodoTariffarioService {
  private readonly baseUrl = `${environment.apiUrl}/periodi`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PeriodoTariffario[]> {
    return this.http.get<PeriodoTariffario[]>(this.baseUrl);
  }

  getById(id: number): Observable<PeriodoTariffario> {
    return this.http.get<PeriodoTariffario>(`${this.baseUrl}/${id}`);
  }

  getPerData(data: string): Observable<PeriodoTariffario> {
    const params = new HttpParams().set('data', data);
    return this.http.get<PeriodoTariffario>(`${this.baseUrl}/per-data`, { params });
  }

  create(periodo: PeriodoTariffario): Observable<PeriodoTariffario> {
    return this.http.post<PeriodoTariffario>(this.baseUrl, periodo);
  }

  update(id: number, periodo: PeriodoTariffario): Observable<PeriodoTariffario> {
    return this.http.put<PeriodoTariffario>(`${this.baseUrl}/${id}`, periodo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
