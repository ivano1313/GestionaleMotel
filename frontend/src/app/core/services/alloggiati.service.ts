import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlloggiatiService {
  private baseUrl = `${environment.apiUrl}/alloggiati`;

  constructor(private http: HttpClient) {}

  /**
   * Scarica il file TXT per il Portale Alloggiati Web
   * @param data data degli arrivi (formato yyyy-MM-dd)
   */
  exportAlloggiati(data: string): Observable<Blob> {
    const params = new HttpParams().set('data', data);
    return this.http.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }
}
