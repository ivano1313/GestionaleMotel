import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, CameraService } from '../../core/services';
import { Planning, Camera, Prenotazione } from '../../core/models';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <!-- Intestazione -->
      <div class="header">
        <div class="header-left">
          <h1>📅 Planning Camere</h1>
          <p class="subtitle">Visualizza le prenotazioni per camera e data</p>
        </div>
        <div class="header-right">
          <button class="btn" (click)="settimanaPrec()">◀ Indietro</button>
          <button class="btn btn-primary" (click)="vaiAOggi()">Oggi</button>
          <button class="btn" (click)="settimanaSucc()">Avanti ▶</button>
        </div>
      </div>

      <!-- Periodo visualizzato -->
      <div class="periodo">
        Periodo: <strong>{{ dataInizio | date:'d MMMM yyyy' }}</strong> → <strong>{{ dataFine | date:'d MMMM yyyy' }}</strong>
      </div>

      <!-- Legenda -->
      <div class="legenda">
        <span class="legenda-title">LEGENDA:</span>
        <span class="legenda-item">
          <span class="box blu"></span> Confermata (arrivo previsto)
        </span>
        <span class="legenda-item">
          <span class="box verde"></span> In corso (ospite in camera)
        </span>
        <span class="legenda-item">
          <span class="box grigio"></span> Completata
        </span>
        <span class="legenda-item">
          <span class="box rosso"></span> Cancellata
        </span>
        <span class="legenda-item">
          <span class="box vuoto"></span> Libera
        </span>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        Caricamento in corso...
      </div>

      <!-- Errore -->
      <div *ngIf="error" class="errore">
        {{ error }}
      </div>

      <!-- Tabella Planning -->
      <div *ngIf="!loading && !error" class="tabella-wrapper">
        <table class="tabella">
          <thead>
            <tr>
              <th class="col-camera">CAMERA</th>
              <th *ngFor="let g of giorni"
                  class="col-giorno"
                  [class.weekend]="isWeekend(g)"
                  [class.oggi]="isToday(g)">
                <div class="giorno-nome">{{ getNomeGiorno(g) }}</div>
                <div class="giorno-num">{{ g | date:'d' }}</div>
                <div class="giorno-mese">{{ g | date:'MMM' }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let camera of camere">
              <td class="col-camera">
                <div class="camera-num">{{ camera.numero }}</div>
                <div class="camera-tipo">{{ camera.tipologiaNome }}</div>
              </td>
              <td *ngFor="let g of giorni"
                  class="col-giorno"
                  [class.weekend]="isWeekend(g)"
                  [class.oggi]="isToday(g)"
                  [class.occupata]="getPrenotazione(camera.id!, g)"
                  [class.stato-confermata]="getStato(camera.id!, g) === 'CONFERMATA'"
                  [class.stato-incorso]="getStato(camera.id!, g) === 'IN_CORSO'"
                  [class.stato-completata]="getStato(camera.id!, g) === 'COMPLETATA'"
                  [class.stato-cancellata]="getStato(camera.id!, g) === 'CANCELLATA'">
                <a *ngIf="getPrenotazione(camera.id!, g) as pren"
                   [routerLink]="['/prenotazioni', pren.id]"
                   class="cella-prenotata"
                   [title]="pren.nominativoTitolare + ' - ' + pren.stato">
                  <span *ngIf="isInizio(camera.id!, g)" class="nome-ospite">
                    {{ pren.nominativoTitolare || 'Ospite' }}
                  </span>
                </a>
                <a *ngIf="!getPrenotazione(camera.id!, g)"
                   [routerLink]="['/prenotazioni/nuova']"
                   [queryParams]="{cameraId: camera.id, checkIn: formatDate(g)}"
                   class="cella-libera"
                   title="Clicca per prenotare">
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Riepilogo -->
      <div *ngIf="!loading && !error" class="riepilogo">
        <div class="box-stat">
          <div class="stat-valore">{{ camere.length }}</div>
          <div class="stat-label">Camere</div>
        </div>
        <div class="box-stat">
          <div class="stat-valore">{{ contaPrenotazioni() }}</div>
          <div class="stat-label">Prenotazioni nel periodo</div>
        </div>
        <div class="box-stat">
          <div class="stat-valore">{{ calcolaOccupazione() }}%</div>
          <div class="stat-label">Tasso occupazione</div>
        </div>
      </div>

      <!-- Istruzioni -->
      <div class="istruzioni">
        <strong>Come usare il planning:</strong>
        <ul>
          <li>Ogni riga rappresenta una camera</li>
          <li>Ogni colonna rappresenta un giorno</li>
          <li>Le celle colorate indicano prenotazioni - clicca per vedere i dettagli</li>
          <li>Le celle vuote sono disponibili - clicca per creare una nuova prenotazione</li>
          <li>I weekend (Sab-Dom) hanno sfondo giallo</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      background: #f5f5f5;
      min-height: 100vh;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    .subtitle {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 14px;
    }

    .header-right {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }

    .btn:hover {
      background: #f0f0f0;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    .btn-primary:hover {
      background: #1d4ed8;
    }

    /* Periodo */
    .periodo {
      background: white;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-size: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Legenda */
    .legenda {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: center;
      background: white;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .legenda-title {
      font-weight: 700;
      color: #333;
    }

    .legenda-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #555;
    }

    .box {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    .box.blu { background: #3b82f6; border-color: #3b82f6; }
    .box.verde { background: #22c55e; border-color: #22c55e; }
    .box.grigio { background: #9ca3af; border-color: #9ca3af; }
    .box.rosso { background: #ef4444; border-color: #ef4444; }
    .box.vuoto { background: white; }

    /* Loading e Errore */
    .loading, .errore {
      background: white;
      padding: 40px;
      text-align: center;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .errore {
      color: #dc2626;
      background: #fef2f2;
    }

    /* Tabella */
    .tabella-wrapper {
      background: white;
      border-radius: 8px;
      overflow-x: auto;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 15px;
    }

    .tabella {
      width: 100%;
      border-collapse: collapse;
      min-width: 1000px;
    }

    .tabella th,
    .tabella td {
      border: 1px solid #e0e0e0;
      text-align: center;
      vertical-align: middle;
    }

    /* Colonna Camera */
    .col-camera {
      width: 140px;
      min-width: 140px;
      padding: 12px;
      background: #1e293b;
      color: white;
      font-weight: 600;
      position: sticky;
      left: 0;
      z-index: 10;
    }

    tbody .col-camera {
      background: #f8fafc;
      color: #333;
      text-align: left;
      border-right: 2px solid #1e293b;
    }

    .camera-num {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .camera-tipo {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
    }

    /* Colonne Giorni */
    .col-giorno {
      width: 70px;
      min-width: 70px;
      height: 60px;
      padding: 8px 4px;
      background: white;
    }

    th.col-giorno {
      background: #f1f5f9;
      height: auto;
    }

    th.col-giorno.weekend {
      background: #fef3c7;
    }

    th.col-giorno.oggi {
      background: #dbeafe;
    }

    td.col-giorno.weekend {
      background: #fffbeb;
    }

    td.col-giorno.oggi {
      background: #eff6ff;
    }

    .giorno-nome {
      font-size: 11px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
    }

    .giorno-num {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }

    .giorno-mese {
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
    }

    th.col-giorno.oggi .giorno-num {
      color: #2563eb;
    }

    /* Celle occupate */
    td.occupata {
      padding: 4px;
    }

    td.stato-confermata { background: #3b82f6 !important; }
    td.stato-incorso { background: #22c55e !important; }
    td.stato-completata { background: #9ca3af !important; }
    td.stato-cancellata { background: #fca5a5 !important; }

    .cella-prenotata {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      min-height: 48px;
      text-decoration: none;
    }

    .nome-ospite {
      color: white;
      font-size: 11px;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0 4px;
    }

    .cella-libera {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 48px;
    }

    .cella-libera:hover {
      background: #dcfce7;
    }

    /* Riepilogo */
    .riepilogo {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }

    .box-stat {
      background: white;
      padding: 20px 30px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-valore {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 5px;
    }

    /* Istruzioni */
    .istruzioni {
      background: #e0f2fe;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #7dd3fc;
    }

    .istruzioni strong {
      color: #0369a1;
    }

    .istruzioni ul {
      margin: 10px 0 0 0;
      padding-left: 20px;
      color: #0c4a6e;
    }

    .istruzioni li {
      margin: 5px 0;
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

  private prenotazioniMap = new Map<number, Map<string, Prenotazione>>();

  constructor(
    private dashboardService: DashboardService,
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {
    this.vaiAOggi();
    this.loadCamere();
  }

  loadCamere(): void {
    this.cameraService.getAll().subscribe({
      next: (camere) => {
        this.camere = camere.sort((a, b) => a.numero.localeCompare(b.numero));
      },
      error: (err) => console.error('Errore caricamento camere', err)
    });
  }

  loadPlanning(): void {
    this.loading = true;
    this.error = '';

    this.dashboardService.getPlanning(
      this.formatDate(this.dataInizio),
      this.formatDate(this.dataFine)
    ).subscribe({
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

      for (const pren of giorno.prenotazioni) {
        if (!pren.cameraId) continue;

        const checkIn = new Date(pren.dataCheckin);
        const checkOut = new Date(pren.dataCheckout);
        const current = new Date(checkIn);

        while (current < checkOut) {
          const key = this.formatDate(current);
          if (!this.prenotazioniMap.has(pren.cameraId)) {
            this.prenotazioniMap.set(pren.cameraId, new Map());
          }
          this.prenotazioniMap.get(pren.cameraId)!.set(key, pren);
          current.setDate(current.getDate() + 1);
        }
      }
    }
  }

  impostaPeriodo(data: Date): void {
    this.dataInizio = new Date(data);
    this.dataInizio.setHours(0, 0, 0, 0);

    this.dataFine = new Date(this.dataInizio);
    this.dataFine.setDate(this.dataFine.getDate() + 13);

    // Genera array giorni
    this.giorni = [];
    const current = new Date(this.dataInizio);
    while (current <= this.dataFine) {
      this.giorni.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    this.loadPlanning();
  }

  getPrenotazione(cameraId: number, giorno: Date): Prenotazione | null {
    const map = this.prenotazioniMap.get(cameraId);
    return map?.get(this.formatDate(giorno)) || null;
  }

  getStato(cameraId: number, giorno: Date): string | null {
    const pren = this.getPrenotazione(cameraId, giorno);
    return pren?.stato || null;
  }

  isInizio(cameraId: number, giorno: Date): boolean {
    const pren = this.getPrenotazione(cameraId, giorno);
    if (!pren) return false;
    return this.formatDate(giorno) === pren.dataCheckin;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  getNomeGiorno(date: Date): string {
    const nomi = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return nomi[date.getDay()];
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  contaPrenotazioni(): number {
    const ids = new Set<number>();
    this.prenotazioniMap.forEach(m => m.forEach(p => {
      if (p.id) ids.add(p.id);
    }));
    return ids.size;
  }

  calcolaOccupazione(): number {
    if (!this.camere.length || !this.giorni.length) return 0;

    let occupate = 0;
    const totale = this.camere.length * this.giorni.length;

    this.camere.forEach(camera => {
      this.giorni.forEach(giorno => {
        if (this.getPrenotazione(camera.id!, giorno)) {
          occupate++;
        }
      });
    });

    return Math.round((occupate / totale) * 100);
  }

  settimanaPrec(): void {
    const d = new Date(this.dataInizio);
    d.setDate(d.getDate() - 14);
    this.impostaPeriodo(d);
  }

  settimanaSucc(): void {
    const d = new Date(this.dataInizio);
    d.setDate(d.getDate() + 14);
    this.impostaPeriodo(d);
  }

  vaiAOggi(): void {
    this.impostaPeriodo(new Date());
  }
}
