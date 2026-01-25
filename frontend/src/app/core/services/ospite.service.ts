import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ospite } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OspiteService {
  private readonly baseUrl = `${environment.apiUrl}/ospiti`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ospite[]> {
    return this.http.get<Ospite[]>(this.baseUrl);
  }

  getById(id: number): Observable<Ospite> {
    return this.http.get<Ospite>(`${this.baseUrl}/${id}`);
  }

  search(termine: string): Observable<Ospite[]> {
    const params = new HttpParams().set('termine', termine);
    return this.http.get<Ospite[]>(`${this.baseUrl}/search`, { params });
  }

  findDuplicati(nome: string, cognome: string, documento?: string): Observable<Ospite[]> {
    let params = new HttpParams()
      .set('nome', nome)
      .set('cognome', cognome);
    if (documento) {
      params = params.set('documento', documento);
    }
    return this.http.get<Ospite[]>(`${this.baseUrl}/duplicati`, { params });
  }

  create(ospite: Ospite): Observable<Ospite> {
    return this.http.post<Ospite>(this.baseUrl, ospite);
  }

  update(id: number, ospite: Ospite): Observable<Ospite> {
    return this.http.put<Ospite>(`${this.baseUrl}/${id}`, ospite);
  }
}
