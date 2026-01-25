import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OspiteService } from '../../../core/services';
import { Ospite } from '../../../core/models';

@Component({
  selector: 'app-ospite-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      } @else if (error) {
        <div class="alert alert-error">{{ error }}</div>
        <a routerLink="/ospiti" class="btn btn-secondary">Torna alla lista</a>
      } @else if (ospite) {
        <div class="page-header">
          <div class="header-left">
            <a routerLink="/ospiti" class="back-link">← Torna alla lista</a>
            <h1 class="page-title">{{ ospite.cognome }} {{ ospite.nome }}</h1>
          </div>
          <div class="header-actions">
            <a [routerLink]="['/ospiti', ospite.id, 'modifica']" class="btn btn-primary">
              Modifica
            </a>
          </div>
        </div>

        <div class="detail-grid">
          <!-- Dati Anagrafici -->
          <div class="card">
            <h3 class="card-title">Dati Anagrafici</h3>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="label">Cognome</span>
                <span class="value">{{ ospite.cognome }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Nome</span>
                <span class="value">{{ ospite.nome }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Sesso</span>
                <span class="value">{{ ospite.sesso === 'M' ? 'Maschio' : 'Femmina' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Data di Nascita</span>
                <span class="value">{{ ospite.dataNascita }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Luogo di Nascita</span>
                <span class="value">{{ ospite.comuneNascitaNome || ospite.statoNascitaNome || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Cittadinanza</span>
                <span class="value">{{ ospite.cittadinanzaNome || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Documento -->
          <div class="card">
            <h3 class="card-title">Documento di Identità</h3>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="label">Tipo Documento</span>
                <span class="value">{{ ospite.tipoDocumentoSigla || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Numero Documento</span>
                <span class="value documento">{{ ospite.numeroDocumento }}</span>
              </div>
            </div>
          </div>

          <!-- Contatti -->
          <div class="card">
            <h3 class="card-title">Contatti</h3>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="label">Telefono</span>
                <span class="value">
                  @if (ospite.telefono) {
                    <a href="tel:{{ ospite.telefono }}" class="link">{{ ospite.telefono }}</a>
                  } @else {
                    -
                  }
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Email</span>
                <span class="value">
                  @if (ospite.email) {
                    <a href="mailto:{{ ospite.email }}" class="link">{{ ospite.email }}</a>
                  } @else {
                    -
                  }
                </span>
              </div>
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

    .back-link:hover {
      text-decoration: underline;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
    }

    .detail-rows {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      font-size: 0.875rem;
      color: #666;
    }

    .value {
      font-weight: 500;
      color: #333;
    }

    .value.documento {
      font-family: monospace;
      background: #f0f0f0;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .link {
      color: #667eea;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
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
      border: 1px solid #f5c6cb;
    }
  `]
})
export class OspiteDetailComponent implements OnInit {
  ospite: Ospite | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ospiteService: OspiteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOspite(+id);
    } else {
      this.error = 'ID ospite non valido';
      this.loading = false;
    }
  }

  loadOspite(id: number): void {
    this.ospiteService.getById(id).subscribe({
      next: (data) => {
        this.ospite = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento dell\'ospite';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
