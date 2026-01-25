import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MetodoPagamento } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagamentoService {
  private readonly baseUrl = `${environment.apiUrl}/metodi-pagamento`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MetodoPagamento[]> {
    return this.http.get<MetodoPagamento[]>(this.baseUrl);
  }

  getById(id: number): Observable<MetodoPagamento> {
    return this.http.get<MetodoPagamento>(`${this.baseUrl}/${id}`);
  }

  create(metodo: MetodoPagamento): Observable<MetodoPagamento> {
    return this.http.post<MetodoPagamento>(this.baseUrl, metodo);
  }

  update(id: number, metodo: MetodoPagamento): Observable<MetodoPagamento> {
    return this.http.put<MetodoPagamento>(`${this.baseUrl}/${id}`, metodo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
