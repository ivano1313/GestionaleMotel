import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpesaService, CategoriaSpesaService } from '../../../core/services';
import { Spesa, CategoriaSpesa } from '../../../core/models';

@Component({
  selector: 'app-spese-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Registro Spese</h1>
        <div class="header-actions">
          <a routerLink="/categorie-spesa" class="btn btn-outline">Gestisci Categorie</a>
          <button class="btn btn-primary" (click)="openNewSpesa()">+ Nuova Spesa</button>
        </div>
      </div>

      <!-- Filtri -->
      <div class="filters-container">
        <div class="filter-group">
          <label>Categoria</label>
          <select [(ngModel)]="filtroCategoria" (change)="loadSpese()">
            <option [ngValue]="null">Tutte</option>
            @for (cat of categorie; track cat.id) {
              <option [ngValue]="cat.id">{{ cat.nome }}</option>
            }
          </select>
        </div>
        <div class="filter-group">
          <label>Da</label>
          <input type="date" [(ngModel)]="filtroDa" (change)="loadSpese()">
        </div>
        <div class="filter-group">
          <label>A</label>
          <input type="date" [(ngModel)]="filtroA" (change)="loadSpese()">
        </div>
        <button class="btn btn-sm btn-outline" (click)="resetFiltri()">Reset</button>
      </div>

      <!-- Totale periodo -->
      @if (filtroDa && filtroA) {
        <div class="totale-container">
          <span class="totale-label">Totale periodo:</span>
          <span class="totale-value">{{ totalePeriodo | currency:'EUR' }}</span>
        </div>
      }

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
                <th>Data</th>
                <th>Categoria</th>
                <th>Descrizione</th>
                <th class="text-right">Importo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              @for (spesa of spese; track spesa.id) {
                <tr>
                  <td>{{ spesa.dataSpesa | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <span class="badge badge-categoria">{{ spesa.categoriaNome }}</span>
                  </td>
                  <td>
                    <strong>{{ spesa.descrizione }}</strong>
                    @if (spesa.note) {
                      <div class="note-preview">{{ spesa.note }}</div>
                    }
                  </td>
                  <td class="text-right importo">{{ spesa.importo | currency:'EUR' }}</td>
                  <td>
                    <div class="actions">
                      <button class="btn btn-sm btn-outline" (click)="editSpesa(spesa)">
                        Modifica
                      </button>
                      <button class="btn btn-sm btn-danger" (click)="confirmDelete(spesa)">
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="empty-row">Nessuna spesa trovata</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="results-info">
          {{ spese.length }} spese trovate
        </div>
      }

      <!-- Modal Form Spesa -->
      @if (showForm) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingSpesa ? 'Modifica' : 'Nuova' }} Spesa</h2>
              <button class="close-btn" (click)="closeForm()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Categoria *</label>
                <select [(ngModel)]="formData.categoriaId">
                  <option [ngValue]="null" disabled>Seleziona categoria</option>
                  @for (cat of categorie; track cat.id) {
                    <option [ngValue]="cat.id">{{ cat.nome }}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label>Descrizione *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.descrizione"
                  placeholder="Es. Bolletta gas dicembre"
                >
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Importo *</label>
                  <input
                    type="number"
                    [(ngModel)]="formData.importo"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                  >
                </div>
                <div class="form-group">
                  <label>Data *</label>
                  <input
                    type="date"
                    [(ngModel)]="formData.dataSpesa"
                  >
                </div>
              </div>
              <div class="form-group">
                <label>Note</label>
                <textarea
                  [(ngModel)]="formData.note"
                  rows="3"
                  placeholder="Note aggiuntive..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeForm()">Annulla</button>
              <button
                class="btn btn-primary"
                (click)="saveSpesa()"
                [disabled]="!formData.categoriaId || !formData.descrizione || !formData.importo || !formData.dataSpesa"
              >
                {{ editingSpesa ? 'Aggiorna' : 'Crea' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal Conferma Eliminazione -->
      @if (showDeleteConfirm) {
        <div class="modal-overlay" (click)="showDeleteConfirm = false">
          <div class="modal modal-sm" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Conferma eliminazione</h2>
              <button class="close-btn" (click)="showDeleteConfirm = false">×</button>
            </div>
            <div class="modal-body">
              <p>Sei sicuro di voler eliminare questa spesa?</p>
              <p><strong>{{ deletingSpesa?.descrizione }}</strong></p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="showDeleteConfirm = false">Annulla</button>
              <button class="btn btn-danger" (click)="deleteSpesa()">Elimina</button>
            </div>
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
      gap: 0.75rem;
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

    .filter-group select,
    .filter-group input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .totale-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background: #e8f4fd;
      border-radius: 6px;
    }

    .totale-label {
      font-weight: 500;
      color: #555;
    }

    .totale-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a2e;
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
      color: #dc3545;
    }

    .note-preview {
      font-size: 0.75rem;
      color: #888;
      margin-top: 0.25rem;
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge-categoria {
      background: #e0e7ff;
      color: #4338ca;
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

    .btn-outline {
      background: white;
      border: 1px solid #667eea;
      color: #667eea;
    }

    .btn-danger {
      background: #dc3545;
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
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-sm {
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

    .form-group {
      margin-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
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
export class SpeseListComponent implements OnInit {
  spese: Spesa[] = [];
  categorie: CategoriaSpesa[] = [];
  loading = true;
  error = '';

  // Filtri
  filtroCategoria: number | null = null;
  filtroDa: string = '';
  filtroA: string = '';
  totalePeriodo: number = 0;

  // Form spesa
  showForm = false;
  editingSpesa: Spesa | null = null;
  formData: Partial<Spesa> = {};

  // Eliminazione
  showDeleteConfirm = false;
  deletingSpesa: Spesa | null = null;

  constructor(
    private spesaService: SpesaService,
    private categoriaSpesaService: CategoriaSpesaService
  ) {}

  ngOnInit(): void {
    this.loadCategorie();
    this.loadSpese();
  }

  loadCategorie(): void {
    this.categoriaSpesaService.getAll().subscribe({
      next: (data) => {
        this.categorie = data;
      },
      error: (err) => console.error('Errore caricamento categorie', err)
    });
  }

  loadSpese(): void {
    this.loading = true;
    const categoriaId = this.filtroCategoria ?? undefined;
    const da = this.filtroDa || undefined;
    const a = this.filtroA || undefined;

    this.spesaService.getAll(categoriaId, da, a).subscribe({
      next: (data) => {
        this.spese = data;
        this.loading = false;

        // Calcola totale se filtri data presenti
        if (da && a) {
          this.loadTotale(da, a);
        } else {
          this.totalePeriodo = 0;
        }
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle spese';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadTotale(da: string, a: string): void {
    this.spesaService.getTotale(da, a).subscribe({
      next: (totale) => {
        this.totalePeriodo = totale;
      },
      error: (err) => console.error('Errore calcolo totale', err)
    });
  }

  resetFiltri(): void {
    this.filtroCategoria = null;
    this.filtroDa = '';
    this.filtroA = '';
    this.loadSpese();
  }

  openNewSpesa(): void {
    this.editingSpesa = null;
    this.formData = {
      categoriaId: undefined,
      descrizione: '',
      importo: undefined,
      dataSpesa: new Date().toISOString().split('T')[0],
      note: ''
    };
    this.showForm = true;
  }

  editSpesa(spesa: Spesa): void {
    this.editingSpesa = spesa;
    this.formData = { ...spesa };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingSpesa = null;
    this.formData = {};
  }

  saveSpesa(): void {
    if (!this.formData.categoriaId || !this.formData.descrizione || !this.formData.importo || !this.formData.dataSpesa) return;

    const spesa: Spesa = {
      categoriaId: this.formData.categoriaId,
      descrizione: this.formData.descrizione,
      importo: this.formData.importo,
      dataSpesa: this.formData.dataSpesa,
      note: this.formData.note
    };

    const request = this.editingSpesa
      ? this.spesaService.update(this.editingSpesa.id!, spesa)
      : this.spesaService.create(spesa);

    request.subscribe({
      next: () => {
        this.closeForm();
        this.loadSpese();
      },
      error: (err) => console.error('Errore salvataggio spesa', err)
    });
  }

  confirmDelete(spesa: Spesa): void {
    this.deletingSpesa = spesa;
    this.showDeleteConfirm = true;
  }

  deleteSpesa(): void {
    if (!this.deletingSpesa?.id) return;

    this.spesaService.delete(this.deletingSpesa.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.deletingSpesa = null;
        this.loadSpese();
      },
      error: (err) => console.error('Errore eliminazione spesa', err)
    });
  }
}
