import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Dashboard, Planning } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(this.baseUrl);
  }

  getPlanning(dataDa: string, dataA: string): Observable<Planning> {
    const params = new HttpParams()
      .set('da', dataDa)
      .set('a', dataA);
    return this.http.get<Planning>(`${this.baseUrl}/planning`, { params });
  }
}
