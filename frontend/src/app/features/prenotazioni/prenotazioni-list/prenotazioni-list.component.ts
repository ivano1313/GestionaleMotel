import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrenotazioneService } from '../../../core/services';
import { Prenotazione, StatoPrenotazione } from '../../../core/models';

@Component({
  selector: 'app-prenotazioni-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Prenotazioni</h1>
        <a routerLink="/prenotazioni/nuova" class="btn btn-primary">+ Nuova Prenotazione</a>
      </div>

      <!-- Filtri -->
      <div class="filters card">
        <div class="filters-row">
          <div class="filter-group">
            <label>Stato</label>
            <select [(ngModel)]="filtroStato" (change)="applicaFiltri()">
              <option value="">Tutti</option>
              <option value="CONFERMATA">Confermata</option>
              <option value="IN_CORSO">In corso</option>
              <option value="COMPLETATA">Completata</option>
              <option value="CANCELLATA">Cancellata</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Ricerca</label>
            <input
              type="text"
              [(ngModel)]="filtroRicerca"
              (input)="applicaFiltri()"
              placeholder="Camera, ospite..."
            >
          </div>
        </div>
      </div>

      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      } @else if (error) {
        <div class="alert alert-error">{{ error }}</div>
      } @else {
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Camera</th>
                <th>Ospite</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Stato</th>
                <th>Prezzo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              @for (prenotazione of prenotazioniFiltrate; track prenotazione.id) {
                <tr>
                  <td>
                    <strong>{{ prenotazione.cameraNumero }}</strong>
                  </td>
                  <td>{{ prenotazione.nominativoTitolare || 'N/D' }}</td>
                  <td>{{ prenotazione.dataCheckin }}</td>
                  <td>{{ prenotazione.dataCheckout }}</td>
                  <td>
                    <span class="badge" [ngClass]="getBadgeClass(prenotazione.stato)">
                      {{ formatStato(prenotazione.stato) }}
                    </span>
                  </td>
                  <td>{{ prenotazione.prezzoTotale | currency:'EUR' }}</td>
                  <td>
                    <div class="actions">
                      <a [routerLink]="['/prenotazioni', prenotazione.id]" class="btn btn-sm btn-outline">
                        Dettagli
                      </a>
                      @if (prenotazione.stato === 'CONFERMATA') {
                        <button
                          class="btn btn-sm btn-primary"
                          (click)="cambiaStato(prenotazione, StatoPrenotazione.IN_CORSO)"
                        >
                          Check-in
                        </button>
                      }
                      @if (prenotazione.stato === 'IN_CORSO') {
                        <button
                          class="btn btn-sm btn-secondary"
                          (click)="cambiaStato(prenotazione, StatoPrenotazione.COMPLETATA)"
                        >
                          Check-out
                        </button>
                      }
                      @if (prenotazione.stato !== 'CANCELLATA' && prenotazione.stato !== 'COMPLETATA') {
                        <button
                          class="btn btn-sm btn-danger"
                          (click)="cancellaPrenotazione(prenotazione)"
                        >
                          Cancella
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="empty-row">Nessuna prenotazione trovata</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="results-info">
          {{ prenotazioniFiltrate.length }} prenotazioni trovate
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1.5rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
    }

    .page-title {
      color: white;
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
    }

    .card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .filters {
      margin-bottom: 1.5rem;
    }

    .filters-row {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      align-items: flex-end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #555;
    }

    .filter-group select,
    .filter-group input {
      padding: 0.75rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      min-width: 180px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .filter-group select:focus,
    .filter-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
    }

    .table-container {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table thead {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .table th {
      padding: 1rem 1.25rem;
      text-align: left;
      font-weight: 600;
      color: white;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table tbody tr {
      transition: all 0.3s ease;
      border-bottom: 1px solid #f0f0f0;
    }

    .table tbody tr:hover {
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
      transform: scale(1.01);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
    }

    .table td {
      padding: 1rem 1.25rem;
      vertical-align: middle;
    }

    .table td strong {
      color: #1a1a2e;
      font-size: 1.1rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
    }

    .btn-outline {
      background: white;
      border: 2px solid #667eea;
      color: #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .btn-danger {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
      color: white;
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(235, 51, 73, 0.4);
    }

    .btn-sm {
      padding: 0.5rem 0.9rem;
      font-size: 0.8rem;
    }

    .badge {
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-confermata {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .badge-in_corso {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
    }

    .badge-completata {
      background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
      color: white;
    }

    .badge-cancellata {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
      color: white;
    }

    .empty-row {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 3rem !important;
      background: #f8f9fa;
    }

    .results-info {
      margin-top: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 10px;
      color: #666;
      font-size: 0.9rem;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .alert-error {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(238, 90, 90, 0.3);
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .filters-row {
        flex-direction: column;
      }

      .filter-group select,
      .filter-group input {
        min-width: 100%;
      }

      .table {
        font-size: 0.85rem;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class PrenotazioniListComponent implements OnInit {
  prenotazioni: Prenotazione[] = [];
  prenotazioniFiltrate: Prenotazione[] = [];
  loading = true;
  error = '';

  filtroStato = '';
  filtroRicerca = '';
  
  // Espongo l'enum per usarlo nel template
  StatoPrenotazione = StatoPrenotazione;

  constructor(private prenotazioneService: PrenotazioneService) {}

  ngOnInit(): void {
    this.loadPrenotazioni();
  }

  loadPrenotazioni(): void {
    this.loading = true;
    this.prenotazioneService.getAll().subscribe({
      next: (data) => {
        this.prenotazioni = data;
        this.applicaFiltri();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle prenotazioni';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applicaFiltri(): void {
    this.prenotazioniFiltrate = this.prenotazioni.filter(p => {
      const matchStato = !this.filtroStato || p.stato === this.filtroStato;
      const matchRicerca = !this.filtroRicerca ||
        p.cameraNumero?.toLowerCase().includes(this.filtroRicerca.toLowerCase()) ||
        p.nominativoTitolare?.toLowerCase().includes(this.filtroRicerca.toLowerCase());
      return matchStato && matchRicerca;
    });
  }

  getBadgeClass(stato: StatoPrenotazione | undefined): string {
    if (!stato) return '';
    return `badge-${stato.toLowerCase()}`;
  }

  formatStato(stato: StatoPrenotazione | undefined): string {
    if (!stato) return '';
    return stato.replace('_', ' ');
  }

  cambiaStato(prenotazione: Prenotazione, nuovoStato: StatoPrenotazione): void {
    if (!prenotazione.id) return;

    this.prenotazioneService.cambiaStato(prenotazione.id, nuovoStato).subscribe({
      next: (updated) => {
        const index = this.prenotazioni.findIndex(p => p.id === prenotazione.id);
        if (index !== -1) {
          this.prenotazioni[index] = updated;
          this.applicaFiltri();
        }
      },
      error: (err) => {
        console.error('Errore cambio stato', err);
        alert('Errore nel cambio stato');
      }
    });
  }

  cancellaPrenotazione(prenotazione: Prenotazione): void {
    if (!prenotazione.id) return;

    if (confirm(`Vuoi cancellare la prenotazione della camera ${prenotazione.cameraNumero}?`)) {
      this.cambiaStato(prenotazione, StatoPrenotazione.CANCELLATA);
    }
  }
}
