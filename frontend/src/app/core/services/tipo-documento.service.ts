import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoDocumento } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  private readonly baseUrl = `${environment.apiUrl}/tipi-documento`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(this.baseUrl);
  }
}
