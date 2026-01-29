import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  PrenotazioneService,
  OspitePrenotazioneService,
  PagamentoService,
  MetodoPagamentoService,
  OspiteService
} from '../../../core/services';
import {
  Prenotazione,
  OspitePrenotazione,
  Pagamento,
  MetodoPagamento,
  Ospite,
  StatoPrenotazione,
  TipoPagamento
} from '../../../core/models';

@Component({
  selector: 'app-prenotazione-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      } @else if (error) {
        <div class="alert alert-error">{{ error }}</div>
        <a routerLink="/prenotazioni" class="btn btn-secondary">Torna alla lista</a>
      } @else if (prenotazione) {
        <div class="page-header">
          <div class="header-left">
            <a routerLink="/prenotazioni" class="back-link">← Torna alla lista</a>
            <h1 class="page-title">Prenotazione #{{ prenotazione.id }}</h1>
          </div>
          <div class="header-actions">
            @if (prenotazione.stato === 'CONFERMATA') {
              <button class="btn btn-success" (click)="cambiaStato(StatoPrenotazione.IN_CORSO)">
                Check-in
              </button>
            }
            @if (prenotazione.stato === 'IN_CORSO') {
              <button class="btn btn-warning" (click)="cambiaStato(StatoPrenotazione.COMPLETATA)">
                Check-out
              </button>
            }
            @if (prenotazione.stato !== 'CANCELLATA' && prenotazione.stato !== 'COMPLETATA') {
              <button class="btn btn-danger" (click)="cambiaStato(StatoPrenotazione.CANCELLATA)">
                Cancella
              </button>
            }
            <a [routerLink]="['/prenotazioni', prenotazione.id, 'modifica']" class="btn btn-secondary">
              Modifica
            </a>
          </div>
        </div>

        <div class="detail-grid">
          <!-- Info Prenotazione -->
          <div class="card">
            <h3 class="card-title">Dettagli Prenotazione</h3>
            <div class="detail-rows">
              <div class="detail-row">
                <span class="label">Camera</span>
                <span class="value camera-numero">{{ prenotazione.cameraNumero }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-in</span>
                <span class="value">{{ prenotazione.dataCheckin | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Check-out</span>
                <span class="value">{{ prenotazione.dataCheckout | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Stato</span>
                <span class="badge" [ngClass]="getBadgeClass(prenotazione.stato)">
                  {{ formatStato(prenotazione.stato) }}
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Prezzo Totale</span>
                <span class="value price">{{ prenotazione.prezzoTotale | currency:'EUR' }}</span>
              </div>
              @if (prenotazione.note) {
                <div class="detail-row notes">
                  <span class="label">Note</span>
                  <span class="value">{{ prenotazione.note }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Riepilogo Pagamenti -->
          <div class="card">
            <h3 class="card-title">Riepilogo Economico</h3>
            <div class="summary-rows">
              <div class="summary-row">
                <span>Totale prenotazione</span>
                <span>{{ prenotazione.prezzoTotale | currency:'EUR' }}</span>
              </div>
              <div class="summary-row">
                <span>Totale pagato</span>
                <span class="paid">{{ totalePagato | currency:'EUR' }}</span>
              </div>
              <div class="summary-row total">
                <span>Saldo dovuto</span>
                <span [class.danger]="saldoDovuto > 0">{{ saldoDovuto | currency:'EUR' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ospiti -->
        <div class="card section-card">
          <div class="card-header">
            <h3 class="card-title">Ospiti</h3>
            <button class="btn btn-sm btn-primary" (click)="showAddOspite = true">
              + Aggiungi Ospite
            </button>
          </div>
          @if (ospiti.length > 0) {
            <div class="ospiti-list">
              @for (op of ospiti; track op.id) {
                <div class="ospite-item" [class.titolare]="op.titolare">
                  <div class="ospite-info">
                    <span class="ospite-nome">{{ op.ospiteCognome }} {{ op.ospiteNome }}</span>
                    @if (op.titolare) {
                      <span class="badge badge-titolare">Titolare</span>
                    }
                  </div>
                  <div class="ospite-actions">
                    @if (!op.titolare) {
                      <button class="btn btn-sm btn-outline" (click)="setTitolare(op)">
                        Imposta titolare
                      </button>
                    }
                    <button class="btn btn-sm btn-danger-outline" (click)="removeOspite(op)">
                      Rimuovi
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state">Nessun ospite associato</div>
          }
        </div>

        <!-- Pagamenti -->
        <div class="card section-card">
          <div class="card-header">
            <h3 class="card-title">Pagamenti</h3>
            <button class="btn btn-sm btn-primary" (click)="showAddPagamento = true">
              + Registra Pagamento
            </button>
          </div>
          @if (pagamenti.length > 0) {
            <div class="pagamenti-list">
              @for (pag of pagamenti; track pag.id) {
                <div class="pagamento-item">
                  <div class="pagamento-info">
                    <span class="pagamento-importo">{{ pag.importo | currency:'EUR' }}</span>
                    <span class="pagamento-metodo">{{ pag.metodoPagamentoNome }}</span>
                    <span class="badge badge-tipo" [ngClass]="'badge-' + pag.tipoPagamento?.toLowerCase()">
                      {{ pag.tipoPagamento }}
                    </span>
                  </div>
                  <span class="pagamento-data">{{ pag.dataPagamento | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state">Nessun pagamento registrato</div>
          }
        </div>

        <!-- Modal Aggiungi Ospite -->
        @if (showAddOspite) {
          <div class="modal-overlay" (click)="showAddOspite = false">
            <div class="modal" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h2>Aggiungi Ospite</h2>
                <button class="close-btn" (click)="showAddOspite = false">×</button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label>Cerca ospite esistente</label>
                  <input
                    type="text"
                    [(ngModel)]="searchOspite"
                    (input)="cercaOspiti()"
                    placeholder="Nome, cognome o documento..."
                  >
                </div>
                @if (ospitiTrovati.length > 0) {
                  <div class="search-results">
                    @for (ospite of ospitiTrovati; track ospite.id) {
                      <div class="search-item" (click)="selectOspite(ospite)">
                        <span class="search-nome">{{ ospite.cognome }} {{ ospite.nome }}</span>
                        <span class="search-doc">{{ ospite.tipoDocumentoSigla }} {{ ospite.numeroDocumento }}</span>
                      </div>
                    }
                  </div>
                }
                <div class="divider">oppure</div>
                <a routerLink="/ospiti/nuovo" class="btn btn-secondary btn-block">
                  Crea nuovo ospite
                </a>
              </div>
            </div>
          </div>
        }

        <!-- Modal Aggiungi Pagamento -->
        @if (showAddPagamento) {
          <div class="modal-overlay" (click)="showAddPagamento = false">
            <div class="modal" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h2>Registra Pagamento</h2>
                <button class="close-btn" (click)="showAddPagamento = false">×</button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label>Importo *</label>
                  <input
                    type="number"
                    [(ngModel)]="nuovoPagamento.importo"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                  >
                </div>
                <div class="form-group">
                  <label>Metodo di Pagamento *</label>
                  <select [(ngModel)]="nuovoPagamento.metodoPagamentoId">
                    <option [ngValue]="null">Seleziona...</option>
                    @for (metodo of metodiPagamento; track metodo.id) {
                      <option [ngValue]="metodo.id">{{ metodo.nome }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label>Tipo Pagamento *</label>
                  <select [(ngModel)]="nuovoPagamento.tipoPagamento">
                    <option [ngValue]="TipoPagamento.SALDO">Saldo</option>
                    <option [ngValue]="TipoPagamento.ACCONTO">Acconto</option>
                    <option [ngValue]="TipoPagamento.CAPARRA">Caparra</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" (click)="showAddPagamento = false">Annulla</button>
                <button
                  class="btn btn-primary"
                  (click)="salvaPagamento()"
                  [disabled]="!nuovoPagamento.importo || !nuovoPagamento.metodoPagamentoId"
                >
                  Registra
                </button>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
      max-width: 1200px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
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

    .detail-grid {
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

    .section-card {
      margin-bottom: 1.5rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
    }

    .card-header .card-title {
      border-bottom: none;
      padding-bottom: 0;
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

    .detail-row.notes {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .label {
      font-size: 0.875rem;
      color: #666;
    }

    .value {
      font-weight: 500;
      color: #333;
    }

    .camera-numero {
      font-size: 1.25rem;
      font-weight: 700;
      color: #667eea;
    }

    .price {
      font-size: 1.1rem;
      color: #28a745;
    }

    .summary-rows {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
    }

    .summary-row.total {
      border-top: 2px solid #eee;
      padding-top: 1rem;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .paid {
      color: #28a745;
    }

    .danger {
      color: #dc3545;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .badge-confermata { background: #d1ecf1; color: #0c5460; }
    .badge-in_corso { background: #d4edda; color: #155724; }
    .badge-completata { background: #e2e3e5; color: #383d41; }
    .badge-cancellata { background: #f8d7da; color: #721c24; }
    .badge-titolare { background: #667eea; color: white; font-size: 0.7rem; }

    .badge-tipo {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
    }
    .badge-saldo { background: #28a745; color: white; }
    .badge-acconto { background: #ffc107; color: #333; }
    .badge-caparra { background: #17a2b8; color: white; }

    .ospiti-list, .pagamenti-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ospite-item, .pagamento-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .ospite-item.titolare {
      background: #e8f0fe;
      border: 1px solid #667eea;
    }

    .ospite-info, .pagamento-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .ospite-nome {
      font-weight: 500;
    }

    .ospite-actions {
      display: flex;
      gap: 0.5rem;
    }

    .pagamento-importo {
      font-weight: 600;
      font-size: 1.1rem;
    }

    .pagamento-metodo {
      color: #666;
      font-size: 0.875rem;
    }

    .pagamento-data {
      color: #999;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      color: #666;
      padding: 2rem;
      font-style: italic;
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

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-warning {
      background: #ffc107;
      color: #333;
    }

    .btn-danger {
      background: #dc3545;
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

    .btn-block {
      display: block;
      width: 100%;
      text-align: center;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }

    .search-results {
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 6px;
      margin-top: 0.5rem;
    }

    .search-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    }

    .search-item:hover {
      background: #f8f9fa;
    }

    .search-item:last-child {
      border-bottom: none;
    }

    .search-nome {
      font-weight: 500;
    }

    .search-doc {
      color: #666;
      font-size: 0.875rem;
    }

    .divider {
      text-align: center;
      color: #999;
      margin: 1rem 0;
      position: relative;
    }

    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: #ddd;
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
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
export class PrenotazioneDetailComponent implements OnInit {
  prenotazione: Prenotazione | null = null;
  ospiti: OspitePrenotazione[] = [];
  pagamenti: Pagamento[] = [];
  metodiPagamento: MetodoPagamento[] = [];
  loading = true;
  error = '';

  totalePagato = 0;
  saldoDovuto = 0;

  // Modal stati
  showAddOspite = false;
  showAddPagamento = false;

  // Ricerca ospite
  searchOspite = '';
  ospitiTrovati: Ospite[] = [];

  // Nuovo pagamento
  nuovoPagamento: Partial<Pagamento> = { importo: 0, metodoPagamentoId: undefined, tipoPagamento: TipoPagamento.SALDO };

  // Espongo enum per template
  StatoPrenotazione = StatoPrenotazione;
  TipoPagamento = TipoPagamento;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prenotazioneService: PrenotazioneService,
    private ospitePrenotazioneService: OspitePrenotazioneService,
    private pagamentoService: PagamentoService,
    private metodoPagamentoService: MetodoPagamentoService,
    private ospiteService: OspiteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAll(+id);
    } else {
      this.error = 'ID prenotazione non valido';
      this.loading = false;
    }
  }

  loadAll(id: number): void {
    this.loading = true;
    this.loadPrenotazione(id);
    this.loadOspiti(id);
    this.loadPagamenti(id);
    this.loadMetodiPagamento();
  }

  loadPrenotazione(id: number): void {
    this.prenotazioneService.getById(id).subscribe({
      next: (data) => {
        this.prenotazione = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento della prenotazione';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadOspiti(id: number): void {
    this.ospitePrenotazioneService.getOspiti(id).subscribe({
      next: (data) => {
        this.ospiti = data;
      },
      error: (err) => console.error('Errore caricamento ospiti', err)
    });
  }

  loadPagamenti(id: number): void {
    this.pagamentoService.getByPrenotazione(id).subscribe({
      next: (data) => {
        this.pagamenti = data;
        this.calcolaTotali();
      },
      error: (err) => console.error('Errore caricamento pagamenti', err)
    });
  }

  loadMetodiPagamento(): void {
    this.metodoPagamentoService.getAll().subscribe({
      next: (data) => {
        this.metodiPagamento = data;
      },
      error: (err) => console.error('Errore caricamento metodi pagamento', err)
    });
  }

  calcolaTotali(): void {
    this.totalePagato = this.pagamenti.reduce((sum, p) => sum + p.importo, 0);
    this.saldoDovuto = (this.prenotazione?.prezzoTotale || 0) - this.totalePagato;
  }

  getBadgeClass(stato: StatoPrenotazione | undefined): string {
    if (!stato) return '';
    return `badge-${stato.toLowerCase()}`;
  }

  formatStato(stato: StatoPrenotazione | undefined): string {
    if (!stato) return '';
    return stato.replace('_', ' ');
  }

  cambiaStato(nuovoStato: StatoPrenotazione): void {
    if (!this.prenotazione?.id) return;

    this.prenotazioneService.cambiaStato(this.prenotazione.id, nuovoStato).subscribe({
      next: (updated) => {
        this.prenotazione = updated;
      },
      error: (err) => console.error('Errore cambio stato', err)
    });
  }

  // Gestione Ospiti
  cercaOspiti(): void {
    if (this.searchOspite.length < 2) {
      this.ospitiTrovati = [];
      return;
    }

    this.ospiteService.search(this.searchOspite).subscribe({
      next: (data) => {
        this.ospitiTrovati = data.slice(0, 10);
      },
      error: (err) => console.error('Errore ricerca ospiti', err)
    });
  }

  selectOspite(ospite: Ospite): void {
    if (!this.prenotazione?.id || !ospite.id) return;

    this.ospitePrenotazioneService.addOspite(this.prenotazione.id, {
      ospiteId: ospite.id,
      titolare: this.ospiti.length === 0
    }).subscribe({
      next: () => {
        this.showAddOspite = false;
        this.searchOspite = '';
        this.ospitiTrovati = [];
        this.loadOspiti(this.prenotazione!.id!);
      },
      error: (err) => console.error('Errore aggiunta ospite', err)
    });
  }

  setTitolare(op: OspitePrenotazione): void {
    if (!this.prenotazione?.id || !op.ospiteId) return;

    this.ospitePrenotazioneService.setTitolare(this.prenotazione.id, op.ospiteId).subscribe({
      next: () => {
        this.loadOspiti(this.prenotazione!.id!);
      },
      error: (err) => console.error('Errore impostazione titolare', err)
    });
  }

  removeOspite(op: OspitePrenotazione): void {
    if (!this.prenotazione?.id || !op.ospiteId) return;

    if (confirm('Rimuovere questo ospite dalla prenotazione?')) {
      this.ospitePrenotazioneService.removeOspite(this.prenotazione.id, op.ospiteId).subscribe({
        next: () => {
          this.loadOspiti(this.prenotazione!.id!);
        },
        error: (err) => console.error('Errore rimozione ospite', err)
      });
    }
  }

  // Gestione Pagamenti
  salvaPagamento(): void {
    if (!this.prenotazione?.id || !this.nuovoPagamento.importo || !this.nuovoPagamento.metodoPagamentoId) return;

    const pagamento: Pagamento = {
      prenotazioneId: this.prenotazione.id,
      importo: this.nuovoPagamento.importo,
      metodoPagamentoId: this.nuovoPagamento.metodoPagamentoId,
      tipoPagamento: this.nuovoPagamento.tipoPagamento
    };

    this.pagamentoService.create(this.prenotazione.id, pagamento).subscribe({
      next: () => {
        this.showAddPagamento = false;
        this.nuovoPagamento = { importo: 0, metodoPagamentoId: undefined, tipoPagamento: TipoPagamento.SALDO };
        this.loadPagamenti(this.prenotazione!.id!);
      },
      error: (err) => console.error('Errore salvataggio pagamento', err)
    });
  }
}
