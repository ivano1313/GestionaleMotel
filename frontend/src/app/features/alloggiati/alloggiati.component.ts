import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlloggiatiService } from '../../core/services';

@Component({
  selector: 'app-alloggiati',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2>Export Schedine Alloggiati Web</h2>
          <p class="text-muted">
            Genera il file TXT da caricare sul Portale Alloggiati della Polizia di Stato.
          </p>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Parametri Export</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label for="dataArrivi" class="form-label">Data Arrivi</label>
                <input
                  type="date"
                  class="form-control"
                  id="dataArrivi"
                  [(ngModel)]="dataArrivi"
                >
                <div class="form-text">
                  Seleziona la data degli arrivi da esportare (check-in del giorno).
                </div>
              </div>

              <button
                class="btn btn-primary"
                (click)="exportAlloggiati()"
                [disabled]="loading"
              >
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i *ngIf="!loading" class="bi bi-download me-2"></i>
                Scarica File TXT
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Istruzioni</h5>
            </div>
            <div class="card-body">
              <ol class="mb-0">
                <li>Seleziona la data degli arrivi</li>
                <li>Clicca su "Scarica File TXT"</li>
                <li>Accedi al <a href="https://alloggiatiweb.poliziadistato.it" target="_blank" rel="noopener">Portale Alloggiati</a></li>
                <li>Vai su "Invio File"</li>
                <li>Carica il file scaricato</li>
              </ol>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-header bg-warning-subtle">
              <h5 class="mb-0">Importante</h5>
            </div>
            <div class="card-body">
              <ul class="mb-0 small">
                <li>Il file include solo prenotazioni con stato <strong>Confermata</strong> o <strong>In Corso</strong></li>
                <li>Gli ospiti devono avere tutti i dati obbligatori compilati</li>
                <li>Il file va caricato <strong>entro 24 ore</strong> dall'arrivo degli ospiti</li>
                <li>Non aprire il file con Excel (potrebbe corrompere il formato)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert messaggi -->
      <div class="row mt-3" *ngIf="messaggio">
        <div class="col-12">
          <div class="alert" [ngClass]="messaggioTipo" role="alert">
            {{ messaggio }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class AlloggiatiComponent {
  dataArrivi: string;
  loading = false;
  messaggio = '';
  messaggioTipo = 'alert-info';

  constructor(private alloggiatiService: AlloggiatiService) {
    // Default: oggi
    this.dataArrivi = new Date().toISOString().split('T')[0];
  }

  exportAlloggiati(): void {
    if (!this.dataArrivi) {
      this.mostraMessaggio('Seleziona una data', 'alert-warning');
      return;
    }

    this.loading = true;
    this.messaggio = '';

    this.alloggiatiService.exportAlloggiati(this.dataArrivi).subscribe({
      next: (blob) => {
        // Verifica se il file e' vuoto
        if (blob.size === 0) {
          this.mostraMessaggio('Nessun arrivo trovato per la data selezionata', 'alert-info');
          this.loading = false;
          return;
        }

        // Download del file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dataFormatted = this.dataArrivi.replace(/-/g, '');
        a.download = `alloggiati_${dataFormatted}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.mostraMessaggio('File scaricato con successo', 'alert-success');
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore export alloggiati:', err);
        this.mostraMessaggio('Errore durante l\'export. Riprova.', 'alert-danger');
        this.loading = false;
      }
    });
  }

  private mostraMessaggio(testo: string, tipo: string): void {
    this.messaggio = testo;
    this.messaggioTipo = tipo;
  }
}
