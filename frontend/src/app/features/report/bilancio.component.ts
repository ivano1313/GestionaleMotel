import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services';
import { Bilancio, IncassoPerMetodo, UscitaPerCategoria } from '../../core/models';

@Component({
  selector: 'app-bilancio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Bilancio</h1>
      </div>

      <!-- Filtri data -->
      <div class="filters-container">
        <div class="filter-group">
          <label>Da</label>
          <input type="date" [(ngModel)]="filtroDa" (change)="loadBilancio()">
        </div>
        <div class="filter-group">
          <label>A</label>
          <input type="date" [(ngModel)]="filtroA" (change)="loadBilancio()">
        </div>
        <button class="btn btn-sm btn-outline" (click)="setMeseCorrente()">Mese corrente</button>
        <button class="btn btn-sm btn-outline" (click)="setMesePrecedente()">Mese precedente</button>
        <button class="btn btn-sm btn-outline" (click)="setAnnoCorrente()">Anno corrente</button>
        <div class="spacer"></div>
        <button class="btn btn-sm btn-export" (click)="exportCsv()" [disabled]="!filtroDa || !filtroA">
          Esporta CSV
        </button>
      </div>

      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      } @else if (error) {
        <div class="alert alert-error">{{ error }}</div>
      } @else if (bilancio) {
        <!-- Card riepilogo -->
        <div class="riepilogo-grid">
          <div class="riepilogo-card entrate">
            <div class="riepilogo-label">Entrate</div>
            <div class="riepilogo-value">{{ bilancio.totaleEntrate | currency:'EUR' }}</div>
          </div>
          <div class="riepilogo-card uscite">
            <div class="riepilogo-label">Uscite</div>
            <div class="riepilogo-value">{{ bilancio.totaleUscite | currency:'EUR' }}</div>
          </div>
          <div class="riepilogo-card saldo" [class.positivo]="bilancio.saldo >= 0" [class.negativo]="bilancio.saldo < 0">
            <div class="riepilogo-label">Saldo</div>
            <div class="riepilogo-value">{{ bilancio.saldo | currency:'EUR' }}</div>
          </div>
        </div>

        <div class="periodo-info">
          Periodo: {{ bilancio.dataDa | date:'dd/MM/yyyy' }} - {{ bilancio.dataA | date:'dd/MM/yyyy' }}
        </div>

        <div class="sections-grid">
          <!-- Entrate per metodo -->
          <div class="section">
            <h2 class="section-title">Entrate per Metodo</h2>
            <div class="breakdown-list">
              @for (metodo of bilancio.entratePerMetodo; track metodo.metodoId) {
                <div class="breakdown-item">
                  <div class="breakdown-info">
                    <span class="breakdown-nome">{{ metodo.metodoNome }}</span>
                    <span class="breakdown-count">{{ metodo.numeroPagamenti }} pagamenti</span>
                  </div>
                  <div class="breakdown-totale entrata">{{ metodo.totale | currency:'EUR' }}</div>
                  <div class="breakdown-bar">
                    <div class="breakdown-bar-fill entrata" [style.width.%]="getPercentualeEntrata(metodo.totale)"></div>
                  </div>
                </div>
              } @empty {
                <div class="empty-message">Nessuna entrata nel periodo</div>
              }
            </div>
          </div>

          <!-- Uscite per categoria -->
          <div class="section">
            <h2 class="section-title">Uscite per Categoria</h2>
            <div class="breakdown-list">
              @for (cat of bilancio.uscitePerCategoria; track cat.categoriaId) {
                <div class="breakdown-item">
                  <div class="breakdown-info">
                    <span class="breakdown-nome">{{ cat.categoriaNome }}</span>
                    <span class="breakdown-count">{{ cat.numeroSpese }} spese</span>
                  </div>
                  <div class="breakdown-totale uscita">{{ cat.totale | currency:'EUR' }}</div>
                  <div class="breakdown-bar">
                    <div class="breakdown-bar-fill uscita" [style.width.%]="getPercentualeUscita(cat.totale)"></div>
                  </div>
                </div>
              } @empty {
                <div class="empty-message">Nessuna uscita nel periodo</div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
      max-width: 1200px;
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
      flex-wrap: wrap;
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

    .riepilogo-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .riepilogo-card {
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      color: white;
    }

    .riepilogo-card.entrate {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    .riepilogo-card.uscite {
      background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    }

    .riepilogo-card.saldo {
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    }

    .riepilogo-card.saldo.positivo {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .riepilogo-card.saldo.negativo {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    }

    .riepilogo-label {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .riepilogo-value {
      font-size: 1.75rem;
      font-weight: 700;
    }

    .periodo-info {
      text-align: center;
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .sections-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .section {
      background: white;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0 0 1rem 0;
    }

    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .breakdown-item {
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .breakdown-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    .breakdown-nome {
      font-weight: 600;
      color: #1a1a2e;
    }

    .breakdown-count {
      font-size: 0.75rem;
      color: #666;
    }

    .breakdown-totale {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .breakdown-totale.entrata {
      color: #28a745;
    }

    .breakdown-totale.uscita {
      color: #dc3545;
    }

    .breakdown-bar {
      height: 6px;
      background: #eee;
      border-radius: 3px;
      overflow: hidden;
    }

    .breakdown-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .breakdown-bar-fill.entrata {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    .breakdown-bar-fill.uscita {
      background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    }

    .empty-message {
      color: #666;
      font-style: italic;
      text-align: center;
      padding: 1rem;
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

    .btn-export {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      border: none;
    }

    .btn-export:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
    }

    .btn-export:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spacer {
      flex: 1;
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

    @media (max-width: 768px) {
      .riepilogo-grid {
        grid-template-columns: 1fr;
      }

      .sections-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BilancioComponent implements OnInit {
  bilancio: Bilancio | null = null;
  loading = true;
  error = '';

  filtroDa: string = '';
  filtroA: string = '';

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.setMeseCorrente();
  }

  loadBilancio(): void {
    if (!this.filtroDa || !this.filtroA) return;

    this.loading = true;
    this.error = '';

    this.reportService.getBilancio(this.filtroDa, this.filtroA).subscribe({
      next: (data) => {
        this.bilancio = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento del bilancio';
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
    this.loadBilancio();
  }

  setMesePrecedente(): void {
    const oggi = new Date();
    const primoGiornoMesePrecedente = new Date(oggi.getFullYear(), oggi.getMonth() - 1, 1);
    const ultimoGiornoMesePrecedente = new Date(oggi.getFullYear(), oggi.getMonth(), 0);
    this.filtroDa = this.formatDate(primoGiornoMesePrecedente);
    this.filtroA = this.formatDate(ultimoGiornoMesePrecedente);
    this.loadBilancio();
  }

  setAnnoCorrente(): void {
    const oggi = new Date();
    const primoGennaio = new Date(oggi.getFullYear(), 0, 1);
    this.filtroDa = this.formatDate(primoGennaio);
    this.filtroA = this.formatDate(oggi);
    this.loadBilancio();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getPercentualeEntrata(totale: number): number {
    if (!this.bilancio || this.bilancio.totaleEntrate === 0) return 0;
    return (totale / this.bilancio.totaleEntrate) * 100;
  }

  getPercentualeUscita(totale: number): number {
    if (!this.bilancio || this.bilancio.totaleUscite === 0) return 0;
    return (totale / this.bilancio.totaleUscite) * 100;
  }

  exportCsv(): void {
    if (!this.filtroDa || !this.filtroA) return;

    this.reportService.exportCsv(this.filtroDa, this.filtroA).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `movimenti_${this.filtroDa}_${this.filtroA}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Errore export CSV', err);
        alert('Errore durante l\'export del CSV');
      }
    });
  }
}
