import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurazioneService } from '../../core/services';
import { Configurazione } from '../../core/models';

@Component({
  selector: 'app-configurazione',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Configurazione</h1>
      </div>

      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      } @else if (error) {
        <div class="alert alert-error">{{ error }}</div>
      } @else if (configurazione) {
        <div class="config-grid">
          <!-- Orari -->
          <div class="card">
            <h3 class="card-title">Orari Check-in / Check-out</h3>
            <div class="form-group">
              <label>Orario Check-in</label>
              <input
                type="time"
                [(ngModel)]="configurazione.orarioCheckin"
                class="form-control"
              >
              <span class="hint">Orario standard di ingresso degli ospiti</span>
            </div>
            <div class="form-group">
              <label>Orario Check-out</label>
              <input
                type="time"
                [(ngModel)]="configurazione.orarioCheckout"
                class="form-control"
              >
              <span class="hint">Orario entro cui gli ospiti devono lasciare la camera</span>
            </div>
          </div>

          <!-- Durate -->
          <div class="card">
            <h3 class="card-title">Durata Soggiorno</h3>
            <div class="form-group">
              <label>Durata Minima (notti)</label>
              <input
                type="number"
                [(ngModel)]="configurazione.durataMinima"
                class="form-control"
                min="1"
                max="30"
              >
              <span class="hint">Numero minimo di notti per una prenotazione</span>
            </div>
            <div class="form-group">
              <label>Durata Massima (notti)</label>
              <input
                type="number"
                [(ngModel)]="configurazione.durataMassima"
                class="form-control"
                min="1"
                max="365"
              >
              <span class="hint">Numero massimo di notti per una prenotazione</span>
            </div>
          </div>
        </div>

        @if (successMessage) {
          <div class="alert alert-success">{{ successMessage }}</div>
        }

        <div class="form-actions">
          <button
            class="btn btn-primary"
            (click)="salva()"
            [disabled]="saving"
          >
            @if (saving) {
              Salvataggio...
            } @else {
              Salva Configurazione
            }
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
      max-width: 800px;
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

    .config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
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
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .hint {
      display: block;
      font-size: 0.75rem;
      color: #888;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
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
  `]
})
export class ConfigurazioneComponent implements OnInit {
  configurazione: Configurazione | null = null;
  loading = true;
  saving = false;
  error = '';
  successMessage = '';

  constructor(private configurazioneService: ConfigurazioneService) {}

  ngOnInit(): void {
    this.loadConfigurazione();
  }

  loadConfigurazione(): void {
    this.loading = true;
    this.configurazioneService.get().subscribe({
      next: (data) => {
        this.configurazione = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento della configurazione';
        this.loading = false;
        console.error(err);
      }
    });
  }

  salva(): void {
    if (!this.configurazione) return;

    this.saving = true;
    this.successMessage = '';
    this.error = '';

    this.configurazioneService.update(this.configurazione).subscribe({
      next: (data) => {
        this.configurazione = data;
        this.successMessage = 'Configurazione salvata con successo';
        this.saving = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.error = 'Errore nel salvataggio della configurazione';
        this.saving = false;
        console.error(err);
      }
    });
  }
}
