import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaSpesaService } from '../../../core/services';
import { CategoriaSpesa } from '../../../core/models';

@Component({
  selector: 'app-categorie-spesa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <a routerLink="/spese" class="back-link">← Torna alle spese</a>
          <h1 class="page-title">Categorie Spesa</h1>
        </div>
        <button class="btn btn-primary" (click)="showForm = true">+ Nuova Categoria</button>
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
                <th>Nome</th>
                <th>Descrizione</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              @for (categoria of categorie; track categoria.id) {
                <tr>
                  <td><strong>{{ categoria.nome }}</strong></td>
                  <td>{{ categoria.descrizione || '-' }}</td>
                  <td>
                    <span class="badge" [class.badge-active]="categoria.attivo !== false" [class.badge-inactive]="categoria.attivo === false">
                      {{ categoria.attivo !== false ? 'Attiva' : 'Disattivata' }}
                    </span>
                  </td>
                  <td>
                    <div class="actions">
                      <button class="btn btn-sm btn-outline" (click)="editCategoria(categoria)">
                        Modifica
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="empty-row">Nessuna categoria trovata</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="results-info">
          {{ categorie.length }} categorie trovate
        </div>
      }

      <!-- Modal Form Categoria -->
      @if (showForm) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingCategoria ? 'Modifica' : 'Nuova' }} Categoria</h2>
              <button class="close-btn" (click)="closeForm()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Nome Categoria *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.nome"
                  placeholder="Es. Utenze, Manutenzione..."
                >
              </div>
              <div class="form-group">
                <label>Descrizione</label>
                <textarea
                  [(ngModel)]="formData.descrizione"
                  rows="3"
                  placeholder="Descrizione opzionale..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeForm()">Annulla</button>
              <button
                class="btn btn-primary"
                (click)="saveCategoria()"
                [disabled]="!formData.nome"
              >
                {{ editingCategoria ? 'Aggiorna' : 'Crea' }}
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
      max-width: 900px;
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

    .back-link:hover {
      text-decoration: underline;
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
      max-width: 450px;
      max-height: 90vh;
      overflow-y: auto;
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
export class CategorieSpesaListComponent implements OnInit {
  categorie: CategoriaSpesa[] = [];
  loading = true;
  error = '';

  showForm = false;
  editingCategoria: CategoriaSpesa | null = null;
  formData: Partial<CategoriaSpesa> = { nome: '', descrizione: '' };

  constructor(private categoriaSpesaService: CategoriaSpesaService) {}

  ngOnInit(): void {
    this.loadCategorie();
  }

  loadCategorie(): void {
    this.loading = true;
    this.categoriaSpesaService.getAll().subscribe({
      next: (data) => {
        this.categorie = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle categorie';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editCategoria(categoria: CategoriaSpesa): void {
    this.editingCategoria = categoria;
    this.formData = { ...categoria };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingCategoria = null;
    this.formData = { nome: '', descrizione: '' };
  }

  saveCategoria(): void {
    if (!this.formData.nome) return;

    const categoria: CategoriaSpesa = {
      nome: this.formData.nome,
      descrizione: this.formData.descrizione,
      attivo: true
    };

    const request = this.editingCategoria
      ? this.categoriaSpesaService.update(this.editingCategoria.id!, categoria)
      : this.categoriaSpesaService.create(categoria);

    request.subscribe({
      next: () => {
        this.closeForm();
        this.loadCategorie();
      },
      error: (err) => console.error('Errore salvataggio categoria', err)
    });
  }
}
