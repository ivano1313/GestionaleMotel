import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comune } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ComuneService {
  private readonly baseUrl = `${environment.apiUrl}/comuni`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Comune[]> {
    return this.http.get<Comune[]>(this.baseUrl);
  }

  search(nome: string): Observable<Comune[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Comune[]>(`${this.baseUrl}/search`, { params });
  }

  getByProvincia(provincia: string): Observable<Comune[]> {
    return this.http.get<Comune[]>(`${this.baseUrl}/provincia/${provincia}`);
  }
}
