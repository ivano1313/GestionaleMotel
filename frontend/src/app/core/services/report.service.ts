import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReportIncassi, Bilancio } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly baseUrl = `${environment.apiUrl}/report`;

  constructor(private http: HttpClient) {}

  getIncassi(da: string, a: string): Observable<ReportIncassi> {
    const params = new HttpParams()
      .set('da', da)
      .set('a', a);
    return this.http.get<ReportIncassi>(`${this.baseUrl}/incassi`, { params });
  }

  getBilancio(da: string, a: string): Observable<Bilancio> {
    const params = new HttpParams()
      .set('da', da)
      .set('a', a);
    return this.http.get<Bilancio>(`${this.baseUrl}/bilancio`, { params });
  }
}
