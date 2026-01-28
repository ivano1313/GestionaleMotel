import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Spesa } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SpesaService {
  private readonly baseUrl = `${environment.apiUrl}/spese`;

  constructor(private http: HttpClient) {}

  getAll(categoriaId?: number, da?: string, a?: string): Observable<Spesa[]> {
    let params = new HttpParams();
    if (categoriaId) {
      params = params.set('categoriaId', categoriaId.toString());
    }
    if (da) {
      params = params.set('da', da);
    }
    if (a) {
      params = params.set('a', a);
    }
    return this.http.get<Spesa[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Spesa> {
    return this.http.get<Spesa>(`${this.baseUrl}/${id}`);
  }

  create(spesa: Spesa): Observable<Spesa> {
    return this.http.post<Spesa>(this.baseUrl, spesa);
  }

  update(id: number, spesa: Spesa): Observable<Spesa> {
    return this.http.put<Spesa>(`${this.baseUrl}/${id}`, spesa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getTotale(da: string, a: string): Observable<number> {
    const params = new HttpParams()
      .set('da', da)
      .set('a', a);
    return this.http.get<number>(`${this.baseUrl}/totale`, { params });
  }
}
