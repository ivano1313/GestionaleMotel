import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OspiteService } from '../../../core/services';
import { Ospite } from '../../../core/models';

@Component({
  selector: 'app-ospiti-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Ospiti</h1>
        <a routerLink="/ospiti/nuovo" class="btn btn-primary">+ Nuovo Ospite</a>
      </div>

      <!-- Filtri -->
      <div class="filters card">
        <div class="filters-row">
          <div class="filter-group">
            <label>Ricerca</label>
            <input
              type="text"
              [(ngModel)]="filtroRicerca"
              (input)="applicaFiltri()"
              placeholder="Cognome, nome, documento..."
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
                <th>Cognome</th>
                <th>Nome</th>
                <th>Data Nascita</th>
                <th>Cittadinanza</th>
                <th>Documento</th>
                <th>Contatti</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              @for (ospite of ospitiFiltrati; track ospite.id) {
                <tr>
                  <td><strong>{{ ospite.cognome }}</strong></td>
                  <td>{{ ospite.nome }}</td>
                  <td>{{ ospite.dataNascita }}</td>
                  <td>{{ ospite.cittadinanzaNome || '-' }}</td>
                  <td>
                    <span class="documento">
                      {{ ospite.tipoDocumentoSigla }} {{ ospite.numeroDocumento }}
                    </span>
                  </td>
                  <td>
                    <div class="contatti">
                      @if (ospite.telefono) {
                        <span class="contatto">{{ ospite.telefono }}</span>
                      }
                      @if (ospite.email) {
                        <span class="contatto email">{{ ospite.email }}</span>
                      }
                      @if (!ospite.telefono && !ospite.email) {
                        <span class="no-contatto">-</span>
                      }
                    </div>
                  </td>
                  <td>
                    <div class="actions">
                      <a [routerLink]="['/ospiti', ospite.id]" class="btn btn-sm btn-outline">
                        Dettagli
                      </a>
                      <a [routerLink]="['/ospiti', ospite.id, 'modifica']" class="btn btn-sm btn-secondary">
                        Modifica
                      </a>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="empty-row">Nessun ospite trovato</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="results-info">
          {{ ospitiFiltrati.length }} ospiti trovati
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
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(17, 153, 142, 0.3);
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
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
      max-width: 400px;
    }

    .filter-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #555;
    }

    .filter-group input {
      padding: 0.75rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .filter-group input:focus {
      outline: none;
      border-color: #11998e;
      box-shadow: 0 0 0 4px rgba(17, 153, 142, 0.15);
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
      background: linear-gradient(135deg, #f0fff4 0%, #e8f5e9 100%);
      transform: scale(1.01);
      box-shadow: 0 4px 15px rgba(17, 153, 142, 0.1);
    }

    .table td {
      padding: 1rem 1.25rem;
      vertical-align: middle;
    }

    .table td strong {
      color: #1a1a2e;
      font-size: 1.05rem;
    }

    .documento {
      font-family: 'Monaco', 'Consolas', monospace;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .contatti {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .contatto {
      font-size: 0.875rem;
      padding: 0.2rem 0;
    }

    .contatto.email {
      color: #667eea;
      font-weight: 500;
    }

    .no-contatto {
      color: #bbb;
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
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
    }

    .btn-secondary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-outline {
      background: white;
      border: 2px solid #11998e;
      color: #11998e;
    }

    .btn-outline:hover {
      background: #11998e;
      color: white;
    }

    .btn-sm {
      padding: 0.5rem 0.9rem;
      font-size: 0.8rem;
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
      border-top: 4px solid #11998e;
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

      .filter-group {
        max-width: 100%;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class OspitiListComponent implements OnInit {
  ospiti: Ospite[] = [];
  ospitiFiltrati: Ospite[] = [];
  loading = true;
  error = '';
  filtroRicerca = '';

  constructor(private ospiteService: OspiteService) {}

  ngOnInit(): void {
    this.loadOspiti();
  }

  loadOspiti(): void {
    this.loading = true;
    this.ospiteService.getAll().subscribe({
      next: (data) => {
        this.ospiti = data;
        this.applicaFiltri();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento degli ospiti';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applicaFiltri(): void {
    if (!this.filtroRicerca) {
      this.ospitiFiltrati = this.ospiti;
      return;
    }

    const termine = this.filtroRicerca.toLowerCase();
    this.ospitiFiltrati = this.ospiti.filter(o =>
      o.cognome?.toLowerCase().includes(termine) ||
      o.nome?.toLowerCase().includes(termine) ||
      o.numeroDocumento?.toLowerCase().includes(termine) ||
      o.email?.toLowerCase().includes(termine)
    );
  }
}
