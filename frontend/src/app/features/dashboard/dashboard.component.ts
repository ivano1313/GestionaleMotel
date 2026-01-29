import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService, CameraService } from '../../core/services';
import { Dashboard, Prenotazione, Camera, StatoPulizia } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <span class="date-today">{{ oggi | date:'EEEE d MMMM yyyy':'':'it' }}</span>
      </div>

      @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
        </div>
      } @else if (error) {
        <div class="alert alert-error">{{ error }}</div>
      } @else {
        <!-- Statistiche -->
        <div class="stats-grid">
          <div class="stat-card stat-arrivals">
            <div class="stat-icon">&#128205;</div>
            <div class="stat-content">
              <span class="stat-value">{{ dashboard?.arriviOggi || 0 }}</span>
              <span class="stat-label">Arrivi oggi</span>
            </div>
          </div>

          <div class="stat-card stat-departures">
            <div class="stat-icon">&#128682;</div>
            <div class="stat-content">
              <span class="stat-value">{{ dashboard?.partenzeOggi || 0 }}</span>
              <span class="stat-label">Partenze oggi</span>
            </div>
          </div>

          <div class="stat-card stat-occupied">
            <div class="stat-icon">&#127968;</div>
            <div class="stat-content">
              <span class="stat-value">{{ dashboard?.camereOccupate || 0 }}</span>
              <span class="stat-label">Camere occupate</span>
            </div>
          </div>

          <div class="stat-card stat-available">
            <div class="stat-icon">&#128275;</div>
            <div class="stat-content">
              <span class="stat-value">{{ dashboard?.camereDisponibili || 0 }}</span>
              <span class="stat-label">Camere libere</span>
            </div>
          </div>

          <div class="stat-card stat-cleaning">
            <div class="stat-icon">&#129529;</div>
            <div class="stat-content">
              <span class="stat-value">{{ dashboard?.camereDaPulire || 0 }}</span>
              <span class="stat-label">Da pulire</span>
            </div>
          </div>

          <div class="stat-card stat-income">
            <div class="stat-icon">&#128176;</div>
            <div class="stat-content">
              <span class="stat-value">{{ dashboard?.incassiOggi || 0 | currency:'EUR' }}</span>
              <span class="stat-label">Incassi oggi</span>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <!-- Arrivi del giorno -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">&#128205; Arrivi del giorno</h3>
              <a routerLink="/prenotazioni" class="btn btn-sm btn-outline">Vedi tutte</a>
            </div>
            @if (dashboard?.arriviDelGiorno?.length) {
              <div class="booking-list">
                @for (prenotazione of dashboard!.arriviDelGiorno; track prenotazione.id) {
                  <a [routerLink]="['/prenotazioni', prenotazione.id]" class="booking-item">
                    <div class="booking-info">
                      <span class="booking-room">Camera {{ prenotazione.cameraNumero }}</span>
                      <span class="booking-guest">{{ prenotazione.nominativoTitolare || 'N/D' }}</span>
                    </div>
                    <div class="booking-dates">
                      <span>{{ prenotazione.dataCheckin | date:'dd/MM/yyyy' }} - {{ prenotazione.dataCheckout | date:'dd/MM/yyyy' }}</span>
                    </div>
                    <span class="badge" [class]="getBadgeClass(prenotazione.stato)">
                      {{ prenotazione.stato }}
                    </span>
                  </a>
                }
              </div>
            } @else {
              <p class="empty-message">Nessun arrivo previsto per oggi</p>
            }
          </div>

          <!-- Partenze del giorno -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">&#128682; Partenze del giorno</h3>
              <a routerLink="/prenotazioni" class="btn btn-sm btn-outline">Vedi tutte</a>
            </div>
            @if (dashboard?.partenzeDelGiorno?.length) {
              <div class="booking-list">
                @for (prenotazione of dashboard!.partenzeDelGiorno; track prenotazione.id) {
                  <a [routerLink]="['/prenotazioni', prenotazione.id]" class="booking-item">
                    <div class="booking-info">
                      <span class="booking-room">Camera {{ prenotazione.cameraNumero }}</span>
                      <span class="booking-guest">{{ prenotazione.nominativoTitolare || 'N/D' }}</span>
                    </div>
                    <div class="booking-dates">
                      <span>{{ prenotazione.dataCheckin | date:'dd/MM/yyyy' }} - {{ prenotazione.dataCheckout | date:'dd/MM/yyyy' }}</span>
                    </div>
                    <span class="badge" [class]="getBadgeClass(prenotazione.stato)">
                      {{ prenotazione.stato }}
                    </span>
                  </a>
                }
              </div>
            } @else {
              <p class="empty-message">Nessuna partenza prevista per oggi</p>
            }
          </div>

          <!-- Camere da pulire -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">&#129529; Camere da pulire</h3>
              <a routerLink="/camere" class="btn btn-sm btn-outline">Vedi tutte</a>
            </div>
            @if (camereDaPulire.length) {
              <div class="room-list">
                @for (camera of camereDaPulire; track camera.id) {
                  <div class="room-item">
                    <div class="room-info">
                      <span class="room-number">Camera {{ camera.numero }}</span>
                      <span class="room-type">{{ camera.tipologiaNome }}</span>
                    </div>
                    <button
                      class="btn btn-sm btn-primary"
                      (click)="segnaComePulita(camera)"
                      [disabled]="camera.id === puliziaInCorso"
                    >
                      @if (camera.id === puliziaInCorso) {
                        ...
                      } @else {
                        Segna pulita
                      }
                    </button>
                  </div>
                }
              </div>
            } @else {
              <p class="empty-message">Tutte le camere sono pulite</p>
            }
          </div>
        </div>

        <!-- Azioni rapide -->
        <div class="card quick-actions">
          <h3 class="card-title">Azioni rapide</h3>
          <div class="actions-grid">
            <a routerLink="/prenotazioni/nuova" class="action-btn">
              <span class="action-icon">&#10133;</span>
              <span>Nuova prenotazione</span>
            </a>
            <a routerLink="/ospiti/nuovo" class="action-btn">
              <span class="action-icon">&#128100;</span>
              <span>Nuovo ospite</span>
            </a>
            <a routerLink="/planning" class="action-btn">
              <span class="action-icon">&#128197;</span>
              <span>Planning</span>
            </a>
            <a routerLink="/camere" class="action-btn">
              <span class="action-icon">&#128713;</span>
              <span>Gestione camere</span>
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
    }

    .page-title {
      color: white;
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .date-today {
      color: rgba(255,255,255,0.9);
      font-size: 1rem;
      background: rgba(255,255,255,0.2);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      backdrop-filter: blur(10px);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.8);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .stat-arrivals::before { background: linear-gradient(90deg, #4facfe, #00f2fe); }
    .stat-arrivals .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

    .stat-departures::before { background: linear-gradient(90deg, #fa709a, #fee140); }
    .stat-departures .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

    .stat-occupied::before { background: linear-gradient(90deg, #a18cd1, #fbc2eb); }
    .stat-occupied .stat-icon { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }

    .stat-available::before { background: linear-gradient(90deg, #84fab0, #8fd3f4); }
    .stat-available .stat-icon { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); }

    .stat-cleaning::before { background: linear-gradient(90deg, #ffecd2, #fcb69f); }
    .stat-cleaning .stat-icon { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }

    .stat-income::before { background: linear-gradient(90deg, #11998e, #38ef7d); }
    .stat-income .stat-icon { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    /* Card */
    .card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f0f0f0;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0;
    }

    /* Booking List */
    .booking-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .booking-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
      border: 1px solid #eee;
    }

    .booking-item:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transform: translateX(5px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
    }

    .booking-item:hover .booking-room,
    .booking-item:hover .booking-guest,
    .booking-item:hover .booking-dates span {
      color: white;
    }

    .booking-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .booking-room {
      font-weight: 700;
      color: #1a1a2e;
      font-size: 1rem;
      transition: color 0.3s;
    }

    .booking-guest {
      font-size: 0.875rem;
      color: #666;
      transition: color 0.3s;
    }

    .booking-dates {
      font-size: 0.8125rem;
      color: #666;
    }

    .booking-dates span {
      transition: color 0.3s;
    }

    /* Room List */
    .room-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .room-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
      border-radius: 12px;
      border: 1px solid #ffe0e0;
      transition: all 0.3s ease;
    }

    .room-item:hover {
      box-shadow: 0 5px 20px rgba(255,100,100,0.15);
    }

    .room-info {
      display: flex;
      flex-direction: column;
    }

    .room-number {
      font-weight: 700;
      color: #1a1a2e;
    }

    .room-type {
      font-size: 0.875rem;
      color: #666;
    }

    /* Quick Actions */
    .quick-actions {
      margin-top: 1rem;
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .quick-actions .card-title {
      margin-bottom: 1rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
      border-radius: 16px;
      text-decoration: none;
      color: #1a1a2e;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      font-weight: 500;
    }

    .action-btn:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .action-icon {
      font-size: 2rem;
      transition: transform 0.3s;
    }

    .action-btn:hover .action-icon {
      transform: scale(1.2);
    }

    /* Buttons */
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .btn-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid #667eea;
      color: #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
      transform: translateY(-2px);
    }

    /* Empty state */
    .empty-message {
      text-align: center;
      color: #999;
      padding: 2rem;
      font-style: italic;
      background: #f8f9fa;
      border-radius: 12px;
      border: 2px dashed #ddd;
    }

    /* Badges */
    .badge {
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-confermata {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .badge-in_corso {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
    }

    .badge-completata {
      background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
      color: white;
    }

    .badge-cancellata {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
      color: white;
    }

    /* Loading */
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .alert {
      padding: 1rem 1.5rem;
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .alert-error {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(238, 90, 90, 0.3);
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard | null = null;
  camereDaPulire: Camera[] = [];
  loading = true;
  error = '';
  oggi = new Date();
  puliziaInCorso: number | null = null;

  constructor(
    private dashboardService: DashboardService,
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento della dashboard';
        this.loading = false;
        console.error(err);
      }
    });

    this.cameraService.getDaPulire().subscribe({
      next: (camere) => {
        this.camereDaPulire = camere;
      },
      error: (err) => {
        console.error('Errore caricamento camere da pulire', err);
      }
    });
  }

  getBadgeClass(stato: string | undefined): string {
    if (!stato) return 'badge-secondary';
    return `badge badge-${stato.toLowerCase()}`;
  }

  segnaComePulita(camera: Camera): void {
    if (!camera.id) return;

    this.puliziaInCorso = camera.id;
    this.cameraService.cambiaStatoPulizia(camera.id, StatoPulizia.PULITA).subscribe({
      next: () => {
        this.camereDaPulire = this.camereDaPulire.filter(c => c.id !== camera.id);
        if (this.dashboard) {
          this.dashboard.camereDaPulire = Math.max(0, this.dashboard.camereDaPulire - 1);
        }
        this.puliziaInCorso = null;
      },
      error: (err) => {
        console.error('Errore cambio stato pulizia', err);
        this.puliziaInCorso = null;
      }
    });
  }
}
