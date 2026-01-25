import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pagamento } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private readonly baseUrl = `${environment.apiUrl}/prenotazioni`;

  constructor(private http: HttpClient) {}

  getByPrenotazione(prenotazioneId: number): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.baseUrl}/${prenotazioneId}/pagamenti`);
  }

  getTotalePagato(prenotazioneId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${prenotazioneId}/pagamenti/totale-pagato`);
  }

  getSaldoDovuto(prenotazioneId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${prenotazioneId}/pagamenti/saldo-dovuto`);
  }

  create(prenotazioneId: number, pagamento: Pagamento): Observable<Pagamento> {
    return this.http.post<Pagamento>(`${this.baseUrl}/${prenotazioneId}/pagamenti`, pagamento);
  }
}
