import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, CameraService } from '../../core/services';
import { Planning, Camera, Prenotazione, StatoPrenotazione } from '../../core/models';

interface CellData {
  prenotazione: Prenotazione | null;
  isStart: boolean;
  isEnd: boolean;
  isContinuation: boolean;
}

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="planning-container">
      <div class="page-header">
        <h1 class="page-title">Planning</h1>
        <div class="header-actions">
          <div class="date-navigation">
            <button class="btn btn-secondary" (click)="settimanaPrec()">
              &#9664; Precedente
            </button>
            <button class="btn btn-outline" (click)="vaiAOggi()">Oggi</button>
            <button class="btn btn-secondary" (click)="settimanaSucc()">
              Successiva &#9654;
            </button>
          </div>
          <div class="period-info">
            {{ dataInizio | date:'d MMM' }} - {{ dataFine | date:'d MMM yyyy' }}
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
        <!-- Legenda -->
        <div class="legend">
          <div class="legend-section">
            <span class="legend-title">Stato prenotazione:</span>
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-color legend-confermata"></span>
                <span>Confermata (attesa arrivo)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color legend-in_corso"></span>
                <span>In corso (ospite presente)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color legend-completata"></span>
                <span>Completata</span>
              </div>
              <div class="legend-item">
                <span class="legend-color legend-cancellata"></span>
                <span>Cancellata</span>
              </div>
            </div>
          </div>
          <div class="legend-section">
            <span class="legend-title">Simboli:</span>
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-symbol">▶</span>
                <span>Inizio prenotazione (check-in)</span>
              </div>
              <div class="legend-item">
                <span class="legend-symbol">◀</span>
                <span>Fine prenotazione (ultimo giorno)</span>
              </div>
              <div class="legend-item">
                <span class="legend-symbol legend-empty">+</span>
                <span>Cella libera (clicca per prenotare)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Griglia Planning -->
        <div class="planning-grid-wrapper">
          <table class="planning-grid">
            <thead>
              <tr>
                <th class="camera-header">Camera</th>
                @for (giorno of giorni; track giorno) {
                  <th class="day-header" [class.today]="isToday(giorno)">
                    <span class="day-name">{{ giorno | date:'EEE':'':'it' }}</span>
                    <span class="day-number">{{ giorno | date:'d' }}</span>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              @for (camera of camere; track camera.id) {
                <tr>
                  <td class="camera-cell">
                    <span class="camera-numero">{{ camera.numero }}</span>
                    <span class="camera-tipo">{{ camera.tipologiaNome }}</span>
                  </td>
                  @for (giorno of giorni; track giorno) {
                    <ng-container *ngIf="getCellData(camera.id!, giorno) as cellData">
                      <td
                        class="planning-cell"
                        [class.today]="isToday(giorno)"
                        [class.occupied]="cellData.prenotazione"
                        [class.is-start]="cellData.isStart"
                        [class.is-end]="cellData.isEnd"
                        [class.is-middle]="cellData.isContinuation && !cellData.isEnd"
                        [ngClass]="cellData.prenotazione ? 'stato-' + cellData.prenotazione!.stato?.toLowerCase() : ''"
                      >
                        @if (cellData.prenotazione) {
                          <a
                            [routerLink]="['/prenotazioni', cellData.prenotazione!.id]"
                            class="booking-link"
                            [class.is-start]="cellData.isStart"
                            [class.is-end]="cellData.isEnd"
                            [title]="getTooltip(cellData.prenotazione!)"
                          >
                            @if (cellData.isStart) {
                              <span class="booking-indicator">▶</span>
                            }
                            <span class="booking-name">{{ cellData.prenotazione!.nominativoTitolare || 'Prenotato' }}</span>
                            @if (cellData.isEnd) {
                              <span class="booking-indicator">◀</span>
                            }
                          </a>
                        } @else {
                          <a
                            [routerLink]="['/prenotazioni/nuova']"
                            [queryParams]="{cameraId: camera.id, checkIn: formatDate(giorno)}"
                            class="empty-cell"
                            title="Clicca per prenotare camera {{ camera.numero }} il {{ giorno | date:'d/MM' }}"
                          >
                            <span class="empty-icon">+</span>
                          </a>
                        }
                      </td>
                    </ng-container>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .planning-container {
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
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(79, 172, 254, 0.3);
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      color: white;
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .date-navigation {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .btn-secondary {
      background: rgba(255,255,255,0.2);
      color: white;
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
      background: rgba(255,255,255,0.35);
      transform: translateY(-2px);
    }

    .btn-outline {
      background: white;
      color: #4facfe;
      font-weight: 700;
    }

    .btn-outline:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(255,255,255,0.4);
    }

    .period-info {
      font-weight: 700;
      color: white;
      padding: 0.6rem 1.25rem;
      background: rgba(255,255,255,0.2);
      border-radius: 10px;
      backdrop-filter: blur(10px);
    }

    /* Legenda */
    .legend {
      display: flex;
      gap: 3rem;
      margin-bottom: 1.5rem;
      padding: 1.25rem 1.5rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      flex-wrap: wrap;
    }

    .legend-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .legend-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .legend-items {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      font-weight: 500;
      color: #666;
    }

    .legend-color {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }

    .legend-symbol {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
      color: #667eea;
    }

    .legend-symbol.legend-empty {
      background: #f0f0f0;
      border-radius: 4px;
      color: #11998e;
    }

    .legend-confermata { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .legend-in_corso { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
    .legend-completata { background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%); }
    .legend-cancellata { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); }

    /* Griglia */
    .planning-grid-wrapper {
      overflow-x: auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .planning-grid {
      width: 100%;
      border-collapse: collapse;
      min-width: 900px;
    }

    .planning-grid th,
    .planning-grid td {
      border: 1px solid #e8e8e8;
      text-align: center;
    }

    /* Header camere */
    .camera-header {
      width: 140px;
      min-width: 140px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 1rem;
      font-weight: 700;
      position: sticky;
      left: 0;
      z-index: 2;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.85rem;
    }

    /* Header giorni */
    .day-header {
      padding: 0.75rem 0.5rem;
      background: #f8f9fa;
      min-width: 85px;
      transition: all 0.3s ease;
    }

    .day-header.today {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .day-name {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
      opacity: 0.8;
    }

    .day-number {
      display: block;
      font-size: 1.25rem;
      font-weight: 800;
      margin-top: 0.15rem;
    }

    /* Celle camere */
    .camera-cell {
      background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
      padding: 0.75rem;
      text-align: left;
      position: sticky;
      left: 0;
      z-index: 1;
      border-right: 2px solid #e0e0e0;
    }

    .camera-numero {
      display: block;
      font-weight: 800;
      color: #1a1a2e;
      font-size: 1.1rem;
    }

    .camera-tipo {
      display: block;
      font-size: 0.7rem;
      color: #888;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    /* Celle planning */
    .planning-cell {
      padding: 0;
      height: 55px;
      position: relative;
      background: white;
      transition: all 0.2s ease;
    }

    .planning-cell.today {
      background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%);
    }

    .planning-cell.occupied {
      padding: 0;
    }

    .planning-cell.stato-confermata {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .planning-cell.stato-in_corso {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }

    .planning-cell.stato-completata {
      background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
    }

    .planning-cell.stato-cancellata {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
      opacity: 0.6;
    }


    .booking-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: white;
      text-decoration: none;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-shadow: 0 1px 3px rgba(0,0,0,0.3);
      gap: 0.25rem;
      transition: all 0.2s ease;
    }

    .booking-link:hover {
      filter: brightness(1.1);
      transform: scaleY(1.1);
    }

    .booking-name {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    .booking-indicator {
      font-size: 0.6rem;
      opacity: 0.9;
      flex-shrink: 0;
    }

    .planning-cell.is-start .booking-link {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      padding-left: 0.5rem;
    }

    .planning-cell.is-end .booking-link {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      padding-right: 0.5rem;
    }

    .planning-cell.is-middle .booking-link {
      border-radius: 0;
    }

    .empty-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #ccc;
      text-decoration: none;
      transition: all 0.3s ease;
      background: transparent;
    }

    .empty-icon {
      font-size: 1.25rem;
      font-weight: 300;
      opacity: 0.5;
      transition: all 0.3s ease;
    }

    .empty-cell:hover {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    }

    .empty-cell:hover .empty-icon {
      color: #11998e;
      opacity: 1;
      transform: scale(1.3);
      font-weight: 700;
    }

    /* Stili per le celle occupate - bordi collegati */
    .planning-cell.occupied {
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
    }

    .planning-cell.is-start {
      border-left: none;
    }

    .planning-cell.is-end {
      border-right: none;
    }

    .planning-cell.is-middle {
      border-left: none;
      border-right: none;
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
      border-top: 4px solid #4facfe;
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
      .planning-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
        gap: 0.75rem;
      }

      .date-navigation {
        width: 100%;
        justify-content: space-between;
      }

      .legend {
        flex-direction: column;
        gap: 1rem;
      }

      .legend-items {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class PlanningComponent implements OnInit {
  planning: Planning | null = null;
  camere: Camera[] = [];
  giorni: Date[] = [];
  dataInizio!: Date;
  dataFine!: Date;
  loading = true;
  error = '';

  // Mappa per lookup rapido: cameraId -> data -> prenotazione
  private prenotazioniMap = new Map<number, Map<string, Prenotazione>>();

  constructor(
    private dashboardService: DashboardService,
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {
    this.impostaSettimana(new Date());
    this.loadCamere();
  }

  impostaSettimana(data: Date): void {
    // Inizia dalla data specificata
    this.dataInizio = new Date(data);
    this.dataInizio.setHours(0, 0, 0, 0);

    // 14 giorni di visualizzazione
    this.dataFine = new Date(this.dataInizio);
    this.dataFine.setDate(this.dataFine.getDate() + 13);

    this.generaGiorni();
    this.loadPlanning();
  }

  generaGiorni(): void {
    this.giorni = [];
    const current = new Date(this.dataInizio);
    while (current <= this.dataFine) {
      this.giorni.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }

  loadCamere(): void {
    this.cameraService.getAll().subscribe({
      next: (camere) => {
        this.camere = camere.sort((a, b) => a.numero.localeCompare(b.numero));
      },
      error: (err) => {
        console.error('Errore caricamento camere', err);
      }
    });
  }

  loadPlanning(): void {
    this.loading = true;
    this.error = '';

    const da = this.formatDate(this.dataInizio);
    const a = this.formatDate(this.dataFine);

    this.dashboardService.getPlanning(da, a).subscribe({
      next: (planning) => {
        this.planning = planning;
        this.buildPrenotazioniMap();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento del planning';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private buildPrenotazioniMap(): void {
    this.prenotazioniMap.clear();

    if (!this.planning?.giorni) return;

    for (const giorno of this.planning.giorni) {
      if (!giorno.prenotazioni) continue;

      for (const prenotazione of giorno.prenotazioni) {
        if (!prenotazione.cameraId) continue;

        // Per ogni giorno della prenotazione, aggiungiamo alla mappa
        const checkIn = new Date(prenotazione.dataCheckin);
        const checkOut = new Date(prenotazione.dataCheckout);

        const current = new Date(checkIn);
        while (current < checkOut) {
          const dateKey = this.formatDate(current);

          if (!this.prenotazioniMap.has(prenotazione.cameraId)) {
            this.prenotazioniMap.set(prenotazione.cameraId, new Map());
          }

          this.prenotazioniMap.get(prenotazione.cameraId)!.set(dateKey, prenotazione);
          current.setDate(current.getDate() + 1);
        }
      }
    }
  }

  getCellData(cameraId: number, giorno: Date): CellData {
    const dateKey = this.formatDate(giorno);
    const cameraMap = this.prenotazioniMap.get(cameraId);
    const prenotazione = cameraMap?.get(dateKey) || null;

    if (!prenotazione) {
      return { prenotazione: null, isStart: false, isEnd: false, isContinuation: false };
    }

    const checkIn = new Date(prenotazione.dataCheckin);
    const checkOut = new Date(prenotazione.dataCheckout);
    checkOut.setDate(checkOut.getDate() - 1); // L'ultimo giorno è il giorno prima del checkout

    const isStart = this.formatDate(giorno) === this.formatDate(checkIn);
    const isEnd = this.formatDate(giorno) === this.formatDate(checkOut);
    const isContinuation = !isStart;

    return { prenotazione, isStart, isEnd, isContinuation };
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTooltip(prenotazione: Prenotazione): string {
    const nome = prenotazione.nominativoTitolare || 'N/D';
    const stato = prenotazione.stato?.replace('_', ' ') || '';
    return `👤 ${nome}\n📅 Check-in: ${prenotazione.dataCheckin}\n📅 Check-out: ${prenotazione.dataCheckout}\n📌 Stato: ${stato}`;
  }

  settimanaPrec(): void {
    const nuovaData = new Date(this.dataInizio);
    nuovaData.setDate(nuovaData.getDate() - 14);
    this.impostaSettimana(nuovaData);
  }

  settimanaSucc(): void {
    const nuovaData = new Date(this.dataInizio);
    nuovaData.setDate(nuovaData.getDate() + 14);
    this.impostaSettimana(nuovaData);
  }

  vaiAOggi(): void {
    this.impostaSettimana(new Date());
  }
}
