import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Camera, StatoPulizia } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private readonly baseUrl = `${environment.apiUrl}/camere`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Camera[]> {
    return this.http.get<Camera[]>(this.baseUrl);
  }

  getById(id: number): Observable<Camera> {
    return this.http.get<Camera>(`${this.baseUrl}/${id}`);
  }

  getDisponibili(checkIn: string, checkOut: string): Observable<Camera[]> {
    const params = new HttpParams()
      .set('checkIn', checkIn)
      .set('checkOut', checkOut);
    return this.http.get<Camera[]>(`${this.baseUrl}/disponibili`, { params });
  }

  getDaPulire(): Observable<Camera[]> {
    return this.http.get<Camera[]>(`${this.baseUrl}/da-pulire`);
  }

  create(camera: Camera): Observable<Camera> {
    return this.http.post<Camera>(this.baseUrl, camera);
  }

  update(id: number, camera: Camera): Observable<Camera> {
    return this.http.put<Camera>(`${this.baseUrl}/${id}`, camera);
  }

  cambiaStatoPulizia(id: number, stato: StatoPulizia): Observable<Camera> {
    const params = new HttpParams().set('stato', stato);
    return this.http.patch<Camera>(`${this.baseUrl}/${id}/stato-pulizia`, null, { params });
  }
}
