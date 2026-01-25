import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PeriodoTariffarioService } from '../../../core/services';
import { PeriodoTariffario } from '../../../core/models';

@Component({
  selector: 'app-periodi-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/tariffe" class="back-link">← Torna alle tariffe</a>
          <h1 class="page-title">Periodi Tariffari</h1>
        </div>
        <button class="btn btn-primary" (click)="showForm = true">+ Nuovo Periodo</button>
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
                <th>Nome Periodo</th>
                <th>Data Inizio</th>
                <th>Data Fine</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              @for (periodo of periodi; track periodo.id) {
                <tr [class.inactive]="periodo.attivo === false">
                  <td><strong>{{ periodo.nome }}</strong></td>
                  <td>{{ periodo.dataInizio }}</td>
                  <td>{{ periodo.dataFine }}</td>
                  <td>
                    <span class="badge" [class.badge-active]="periodo.attivo !== false" [class.badge-inactive]="periodo.attivo === false">
                      {{ periodo.attivo !== false ? 'Attivo' : 'Disattivato' }}
                    </span>
                  </td>
                  <td>
                    <div class="actions">
                      <button class="btn btn-sm btn-outline" (click)="editPeriodo(periodo)">
                        Modifica
                      </button>
                      <button class="btn btn-sm btn-danger-outline" (click)="deletePeriodo(periodo)">
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="empty-row">Nessun periodo tariffario trovato</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="results-info">
          {{ periodi.length }} periodi trovati
        </div>
      }

      <!-- Modal Form Periodo -->
      @if (showForm) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingPeriodo ? 'Modifica' : 'Nuovo' }} Periodo</h2>
              <button class="close-btn" (click)="closeForm()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Nome Periodo *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.nome"
                  placeholder="Es. Alta Stagione, Bassa Stagione..."
                >
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Data Inizio *</label>
                  <input
                    type="date"
                    [(ngModel)]="formData.dataInizio"
                  >
                </div>
                <div class="form-group">
                  <label>Data Fine *</label>
                  <input
                    type="date"
                    [(ngModel)]="formData.dataFine"
                  >
                </div>
              </div>
              @if (formError) {
                <div class="alert alert-error">{{ formError }}</div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeForm()">Annulla</button>
              <button
                class="btn btn-primary"
                (click)="savePeriodo()"
                [disabled]="!formData.nome || !formData.dataInizio || !formData.dataFine"
              >
                {{ editingPeriodo ? 'Aggiorna' : 'Crea' }}
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
      max-width: 1000px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .back-link {
      color: #667eea;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0;
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

    .table tbody tr.inactive {
      opacity: 0.6;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge-active {
      background: #d4edda;
      color: #155724;
    }

    .badge-inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
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

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-outline {
      background: white;
      border: 1px solid #667eea;
      color: #667eea;
    }

    .btn-danger-outline {
      background: white;
      border: 1px solid #dc3545;
      color: #dc3545;
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.8rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .empty-row {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 2rem !important;
    }

    .results-info {
      margin-top: 1rem;
      color: #666;
      font-size: 0.875rem;
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
      max-width: 500px;
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

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
    }
  `]
})
export class PeriodiListComponent implements OnInit {
  periodi: PeriodoTariffario[] = [];
  loading = true;
  error = '';

  showForm = false;
  editingPeriodo: PeriodoTariffario | null = null;
  formData: Partial<PeriodoTariffario> = { nome: '', dataInizio: '', dataFine: '' };
  formError = '';

  constructor(private periodoService: PeriodoTariffarioService) {}

  ngOnInit(): void {
    this.loadPeriodi();
  }

  loadPeriodi(): void {
    this.loading = true;
    this.periodoService.getAll().subscribe({
      next: (data) => {
        this.periodi = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento dei periodi';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editPeriodo(periodo: PeriodoTariffario): void {
    this.editingPeriodo = periodo;
    this.formData = { ...periodo };
    this.formError = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingPeriodo = null;
    this.formData = { nome: '', dataInizio: '', dataFine: '' };
    this.formError = '';
  }

  savePeriodo(): void {
    if (!this.formData.nome || !this.formData.dataInizio || !this.formData.dataFine) return;

    // Validate dates
    if (this.formData.dataFine < this.formData.dataInizio) {
      this.formError = 'La data fine deve essere successiva alla data inizio';
      return;
    }

    const periodo: PeriodoTariffario = {
      nome: this.formData.nome,
      dataInizio: this.formData.dataInizio,
      dataFine: this.formData.dataFine,
      attivo: true
    };

    const request = this.editingPeriodo
      ? this.periodoService.update(this.editingPeriodo.id!, periodo)
      : this.periodoService.create(periodo);

    request.subscribe({
      next: () => {
        this.closeForm();
        this.loadPeriodi();
      },
      error: (err) => {
        this.formError = err.error?.message || 'Errore nel salvataggio';
        console.error(err);
      }
    });
  }

  deletePeriodo(periodo: PeriodoTariffario): void {
    if (!periodo.id) return;

    if (confirm(`Eliminare il periodo "${periodo.nome}"?`)) {
      this.periodoService.delete(periodo.id).subscribe({
        next: () => this.loadPeriodi(),
        error: (err) => {
          alert('Errore nell\'eliminazione del periodo');
          console.error(err);
        }
      });
    }
  }
}
