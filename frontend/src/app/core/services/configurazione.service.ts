import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Configurazione } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ConfigurazioneService {
  private readonly baseUrl = `${environment.apiUrl}/configurazione`;

  constructor(private http: HttpClient) {}

  get(): Observable<Configurazione> {
    return this.http.get<Configurazione>(this.baseUrl);
  }

  update(configurazione: Configurazione): Observable<Configurazione> {
    return this.http.put<Configurazione>(this.baseUrl, configurazione);
  }
}
