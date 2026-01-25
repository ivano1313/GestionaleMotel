import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TariffaService, TipologiaCameraService, PeriodoTariffarioService } from '../../../core/services';
import { Tariffa, TipologiaCamera, PeriodoTariffario } from '../../../core/models';

@Component({
  selector: 'app-tariffe-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Gestione Tariffe</h1>
        <div class="header-actions">
          <a routerLink="/periodi" class="btn btn-secondary">Gestisci Periodi</a>
        </div>
      </div>

      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      } @else if (error) {
        <div class="alert alert-error">{{ error }}</div>
      } @else {
        <div class="card">
          <p class="info-text">
            Clicca su una cella per modificare il prezzo per notte.
            Le celle vuote indicano che non è stata definita una tariffa.
          </p>

          <div class="table-wrapper">
            <table class="tariffe-table">
              <thead>
                <tr>
                  <th class="tipologia-header">Tipologia</th>
                  @for (periodo of periodi; track periodo.id) {
                    <th class="periodo-header">
                      <div class="periodo-nome">{{ periodo.nome }}</div>
                      <div class="periodo-date">{{ periodo.dataInizio }} - {{ periodo.dataFine }}</div>
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (tipologia of tipologie; track tipologia.id) {
                  <tr>
                    <td class="tipologia-cell">
                      <strong>{{ tipologia.nome }}</strong>
                      <span class="capienza">(max {{ tipologia.capienzaMassima }})</span>
                    </td>
                    @for (periodo of periodi; track periodo.id) {
                      <td
                        class="prezzo-cell"
                        [class.has-price]="getTariffa(tipologia.id!, periodo.id!)"
                        (click)="editTariffa(tipologia, periodo)"
                      >
                        @if (getTariffa(tipologia.id!, periodo.id!); as tariffa) {
                          <span class="prezzo">{{ tariffa.prezzoPerNotte | currency:'EUR' }}</span>
                        } @else {
                          <span class="no-price">-</span>
                        }
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="legend">
          <span class="legend-item">
            <span class="legend-color has-price"></span> Tariffa definita
          </span>
          <span class="legend-item">
            <span class="legend-color no-price"></span> Tariffa non definita
          </span>
        </div>
      }

      <!-- Modal Edit Tariffa -->
      @if (showForm) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingTariffa ? 'Modifica' : 'Nuova' }} Tariffa</h2>
              <button class="close-btn" (click)="closeForm()">×</button>
            </div>
            <div class="modal-body">
              <div class="tariffa-info">
                <div class="info-row">
                  <span class="info-label">Tipologia:</span>
                  <span class="info-value">{{ selectedTipologia?.nome }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Periodo:</span>
                  <span class="info-value">{{ selectedPeriodo?.nome }}</span>
                </div>
              </div>

              <div class="form-group">
                <label>Prezzo per Notte (EUR) *</label>
                <input
                  type="number"
                  [(ngModel)]="formData.prezzoPerNotte"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  class="prezzo-input"
                >
              </div>

              @if (formError) {
                <div class="alert alert-error">{{ formError }}</div>
              }
            </div>
            <div class="modal-footer">
              @if (editingTariffa) {
                <button class="btn btn-danger-outline" (click)="deleteTariffa()">
                  Elimina
                </button>
              }
              <button class="btn btn-secondary" (click)="closeForm()">Annulla</button>
              <button
                class="btn btn-primary"
                (click)="saveTariffa()"
                [disabled]="!formData.prezzoPerNotte || formData.prezzoPerNotte <= 0"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .info-text {
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .tariffe-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;
    }

    .tariffe-table th,
    .tariffe-table td {
      padding: 1rem;
      text-align: center;
      border: 2px solid #333;
    }

    .tipologia-header {
      background: #1a1a2e;
      color: white;
      text-align: left !important;
      min-width: 150px;
    }

    .periodo-header {
      background: #667eea;
      color: white;
      min-width: 120px;
    }

    .periodo-nome {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .periodo-date {
      font-size: 0.7rem;
      opacity: 0.9;
    }

    .tipologia-cell {
      background: #f8f9fa;
      text-align: left !important;
    }

    .capienza {
      display: block;
      font-size: 0.75rem;
      color: #666;
      font-weight: normal;
    }

    .prezzo-cell {
      cursor: pointer;
      transition: background 0.2s;
      background: #ffcccc;
      min-width: 120px;
      min-height: 60px;
    }

    .prezzo-cell:hover {
      background: #b3d9ff;
    }

    .prezzo-cell.has-price {
      background: #ccffcc;
    }

    .prezzo-cell.has-price:hover {
      background: #99e699;
    }

    .prezzo {
      font-weight: 600;
      color: #28a745;
    }

    .no-price {
      color: #cc0000;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .legend {
      display: flex;
      gap: 1.5rem;
      margin-top: 1rem;
      font-size: 0.875rem;
      color: #666;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .legend-color.has-price {
      background: #ccffcc;
    }

    .legend-color.no-price {
      background: #ffcccc;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-danger-outline {
      background: white;
      border: 1px solid #dc3545;
      color: #dc3545;
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

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .tariffa-info {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-label {
      color: #666;
    }

    .info-value {
      font-weight: 500;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .prezzo-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1.25rem;
      text-align: center;
      font-weight: 600;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
    }

    .modal-footer .btn-danger-outline {
      margin-right: auto;
    }
  `]
})
export class TariffeListComponent implements OnInit {
  tipologie: TipologiaCamera[] = [];
  periodi: PeriodoTariffario[] = [];
  tariffe: Tariffa[] = [];
  tariffeMap: Map<string, Tariffa> = new Map();

  loading = true;
  error = '';

  showForm = false;
  editingTariffa: Tariffa | null = null;
  selectedTipologia: TipologiaCamera | null = null;
  selectedPeriodo: PeriodoTariffario | null = null;
  formData: Partial<Tariffa> = { prezzoPerNotte: 0 };
  formError = '';

  constructor(
    private tariffaService: TariffaService,
    private tipologiaService: TipologiaCameraService,
    private periodoService: PeriodoTariffarioService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Load all data in parallel
    this.tipologiaService.getAll().subscribe({
      next: (tipologie) => {
        this.tipologie = tipologie.filter(t => t.attivo !== false);
        this.checkLoading();
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle tipologie';
        this.loading = false;
        console.error(err);
      }
    });

    this.periodoService.getAll().subscribe({
      next: (periodi) => {
        this.periodi = periodi.filter(p => p.attivo !== false);
        this.checkLoading();
      },
      error: (err) => {
        this.error = 'Errore nel caricamento dei periodi';
        this.loading = false;
        console.error(err);
      }
    });

    this.tariffaService.getAll().subscribe({
      next: (tariffe) => {
        this.tariffe = tariffe;
        this.buildTariffeMap();
        this.checkLoading();
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle tariffe';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private loadedCount = 0;
  checkLoading(): void {
    this.loadedCount++;
    if (this.loadedCount >= 3) {
      this.loading = false;
      this.loadedCount = 0;
    }
  }

  buildTariffeMap(): void {
    this.tariffeMap.clear();
    for (const tariffa of this.tariffe) {
      const key = `${tariffa.tipologiaId}-${tariffa.periodoId}`;
      this.tariffeMap.set(key, tariffa);
    }
  }

  getTariffa(tipologiaId: number, periodoId: number): Tariffa | undefined {
    return this.tariffeMap.get(`${tipologiaId}-${periodoId}`);
  }

  editTariffa(tipologia: TipologiaCamera, periodo: PeriodoTariffario): void {
    this.selectedTipologia = tipologia;
    this.selectedPeriodo = periodo;

    const existingTariffa = this.getTariffa(tipologia.id!, periodo.id!);
    if (existingTariffa) {
      this.editingTariffa = existingTariffa;
      this.formData = { prezzoPerNotte: existingTariffa.prezzoPerNotte };
    } else {
      this.editingTariffa = null;
      this.formData = { prezzoPerNotte: 0 };
    }

    this.formError = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTariffa = null;
    this.selectedTipologia = null;
    this.selectedPeriodo = null;
    this.formData = { prezzoPerNotte: 0 };
    this.formError = '';
  }

  saveTariffa(): void {
    if (!this.selectedTipologia?.id || !this.selectedPeriodo?.id || !this.formData.prezzoPerNotte) return;

    const tariffa: Tariffa = {
      tipologiaId: this.selectedTipologia.id,
      periodoId: this.selectedPeriodo.id,
      prezzoPerNotte: this.formData.prezzoPerNotte
    };

    const request = this.editingTariffa
      ? this.tariffaService.update(this.editingTariffa.id!, tariffa)
      : this.tariffaService.create(tariffa);

    request.subscribe({
      next: (result) => {
        // Update local data
        if (this.editingTariffa) {
          const index = this.tariffe.findIndex(t => t.id === this.editingTariffa!.id);
          if (index !== -1) {
            this.tariffe[index] = result;
          }
        } else {
          this.tariffe.push(result);
        }
        this.buildTariffeMap();
        this.closeForm();
      },
      error: (err) => {
        this.formError = err.error?.message || 'Errore nel salvataggio';
        console.error(err);
      }
    });
  }

  deleteTariffa(): void {
    if (!this.editingTariffa?.id) return;

    if (confirm('Eliminare questa tariffa?')) {
      this.tariffaService.delete(this.editingTariffa.id).subscribe({
        next: () => {
          this.tariffe = this.tariffe.filter(t => t.id !== this.editingTariffa!.id);
          this.buildTariffeMap();
          this.closeForm();
        },
        error: (err) => {
          this.formError = 'Errore nell\'eliminazione';
          console.error(err);
        }
      });
    }
  }
}
