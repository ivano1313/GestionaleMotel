import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriaSpesa } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoriaSpesaService {
  private readonly baseUrl = `${environment.apiUrl}/categorie-spesa`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CategoriaSpesa[]> {
    return this.http.get<CategoriaSpesa[]>(this.baseUrl);
  }

  getById(id: number): Observable<CategoriaSpesa> {
    return this.http.get<CategoriaSpesa>(`${this.baseUrl}/${id}`);
  }

  create(categoria: CategoriaSpesa): Observable<CategoriaSpesa> {
    return this.http.post<CategoriaSpesa>(this.baseUrl, categoria);
  }

  update(id: number, categoria: CategoriaSpesa): Observable<CategoriaSpesa> {
    return this.http.put<CategoriaSpesa>(`${this.baseUrl}/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
