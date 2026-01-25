import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Stato } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StatoService {
  private readonly baseUrl = `${environment.apiUrl}/stati`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stato[]> {
    return this.http.get<Stato[]>(this.baseUrl);
  }

  search(nome: string): Observable<Stato[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Stato[]>(`${this.baseUrl}/search`, { params });
  }
}
