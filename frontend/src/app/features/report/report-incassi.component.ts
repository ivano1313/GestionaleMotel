import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services';
import { ReportIncassi, IncassoPerMetodo, PagamentoReport } from '../../core/models';

@Component({
  selector: 'app-report-incassi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Report Incassi</h1>
      </div>

      <!-- Filtri data -->
      <div class="filters-container">
        <div class="filter-group">
          <label>Da</label>
          <input type="date" [(ngModel)]="filtroDa" (change)="loadReport()">
        </div>
        <div class="filter-group">
          <label>A</label>
          <input type="date" [(ngModel)]="filtroA" (change)="loadReport()">
        </div>
        <button class="btn btn-sm btn-outline" (click)="setMeseCorrente()">Mese corrente</button>
        <button class="btn btn-sm btn-outline" (click)="setMesePrecedente()">Mese precedente</button>
      </div>

      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      } @else if (error) {
        <div class="alert alert-error">{{ error }}</div>
      } @else if (report) {
        <!-- Card totale -->
        <div class="totale-card">
          <div class="totale-label">Totale Incassi</div>
          <div class="totale-value">{{ report.totaleIncassi | currency:'EUR' }}</div>
          <div class="totale-periodo">
            dal {{ report.dataDa | date:'dd/MM/yyyy' }} al {{ report.dataA | date:'dd/MM/yyyy' }}
          </div>
        </div>

        <!-- Breakdown per metodo -->
        <div class="section">
          <h2 class="section-title">Incassi per Metodo di Pagamento</h2>
          <div class="metodi-grid">
            @for (metodo of report.incassiPerMetodo; track metodo.metodoId) {
              <div class="metodo-card">
                <div class="metodo-nome">{{ metodo.metodoNome }}</div>
                <div class="metodo-totale">{{ metodo.totale | currency:'EUR' }}</div>
                <div class="metodo-count">{{ metodo.numeroPagamenti }} pagamenti</div>
                <div class="metodo-bar">
                  <div class="metodo-bar-fill" [style.width.%]="getPercentuale(metodo.totale)"></div>
                </div>
              </div>
            } @empty {
              <div class="empty-message">Nessun incasso nel periodo</div>
            }
          </div>
        </div>

        <!-- Lista pagamenti -->
        <div class="section">
          <h2 class="section-title">Dettaglio Pagamenti</h2>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Camera</th>
                  <th>Metodo</th>
                  <th class="text-right">Importo</th>
                </tr>
              </thead>
              <tbody>
                @for (pagamento of paginatedPagamenti; track pagamento.id) {
                  <tr>
                    <td>{{ pagamento.data | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>
                      <span class="badge badge-camera">{{ pagamento.camera }}</span>
                    </td>
                    <td>{{ pagamento.metodo }}</td>
                    <td class="text-right importo">{{ pagamento.importo | currency:'EUR' }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="4" class="empty-row">Nessun pagamento nel periodo</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Paginazione -->
          @if (report.pagamenti.length > pageSize) {
            <div class="pagination">
              <button
                class="btn btn-sm btn-outline"
                (click)="previousPage()"
                [disabled]="currentPage === 0">
                Precedente
              </button>
              <span class="page-info">
                Pagina {{ currentPage + 1 }} di {{ totalPages }}
              </span>
              <button
                class="btn btn-sm btn-outline"
                (click)="nextPage()"
                [disabled]="currentPage >= totalPages - 1">
                Successiva
              </button>
            </div>
          }

          <div class="results-info">
            {{ report.pagamenti.length }} pagamenti totali
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
      max-width: 1100px;
    }

    .page-header {
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0;
    }

    .filters-container {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .filter-group label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #666;
    }

    .filter-group input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .totale-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .totale-label {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .totale-value {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .totale-periodo {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 1rem;
    }

    .metodi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .metodo-card {
      background: white;
      padding: 1.25rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .metodo-nome {
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 0.5rem;
    }

    .metodo-totale {
      font-size: 1.5rem;
      font-weight: 700;
      color: #28a745;
      margin-bottom: 0.25rem;
    }

    .metodo-count {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.75rem;
    }

    .metodo-bar {
      height: 6px;
      background: #eee;
      border-radius: 3px;
      overflow: hidden;
    }

    .metodo-bar-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th,
    .table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #555;
      font-size: 0.875rem;
    }

    .table tbody tr:hover {
      background: #f8f9fa;
    }

    .text-right {
      text-align: right;
    }

    .importo {
      font-weight: 600;
      color: #28a745;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge-camera {
      background: #e0e7ff;
      color: #4338ca;
    }

    .empty-row {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 2rem !important;
    }

    .empty-message {
      color: #666;
      font-style: italic;
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      grid-column: 1 / -1;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .page-info {
      font-size: 0.875rem;
      color: #666;
    }

    .results-info {
      margin-top: 1rem;
      color: #666;
      font-size: 0.875rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-outline {
      background: white;
      border: 1px solid #667eea;
      color: #667eea;
    }

    .btn-outline:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.8rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .alert {
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
    }
  `]
})
export class ReportIncassiComponent implements OnInit {
  report: ReportIncassi | null = null;
  loading = true;
  error = '';

  // Filtri
  filtroDa: string = '';
  filtroA: string = '';

  // Paginazione
  currentPage = 0;
  pageSize = 20;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.setMeseCorrente();
  }

  loadReport(): void {
    if (!this.filtroDa || !this.filtroA) return;

    this.loading = true;
    this.error = '';
    this.currentPage = 0;

    this.reportService.getIncassi(this.filtroDa, this.filtroA).subscribe({
      next: (data) => {
        this.report = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento del report';
        this.loading = false;
        console.error(err);
      }
    });
  }

  setMeseCorrente(): void {
    const oggi = new Date();
    const primoGiorno = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
    this.filtroDa = this.formatDate(primoGiorno);
    this.filtroA = this.formatDate(oggi);
    this.loadReport();
  }

  setMesePrecedente(): void {
    const oggi = new Date();
    const primoGiornoMesePrecedente = new Date(oggi.getFullYear(), oggi.getMonth() - 1, 1);
    const ultimoGiornoMesePrecedente = new Date(oggi.getFullYear(), oggi.getMonth(), 0);
    this.filtroDa = this.formatDate(primoGiornoMesePrecedente);
    this.filtroA = this.formatDate(ultimoGiornoMesePrecedente);
    this.loadReport();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getPercentuale(totale: number): number {
    if (!this.report || this.report.totaleIncassi === 0) return 0;
    return (totale / this.report.totaleIncassi) * 100;
  }

  get paginatedPagamenti(): PagamentoReport[] {
    if (!this.report) return [];
    const start = this.currentPage * this.pageSize;
    return this.report.pagamenti.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    if (!this.report) return 0;
    return Math.ceil(this.report.pagamenti.length / this.pageSize);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }
}
