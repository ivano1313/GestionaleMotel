import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CameraService, TipologiaCameraService } from '../../../core/services';
import { Camera, TipologiaCamera, StatoPulizia } from '../../../core/models';

@Component({
  selector: 'app-camere-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Camere</h1>
        <div class="header-actions">
          <a routerLink="/tipologie" class="btn btn-secondary">Gestisci Tipologie</a>
          <button class="btn btn-primary" (click)="showForm = true">+ Nuova Camera</button>
        </div>
      </div>

      <!-- Filtri -->
      <div class="filters card">
        <div class="filters-row">
          <div class="filter-group">
            <label>Tipologia</label>
            <select [(ngModel)]="filtroTipologia" (change)="applicaFiltri()">
              <option value="">Tutte</option>
              @for (tipologia of tipologie; track tipologia.id) {
                <option [value]="tipologia.id">{{ tipologia.nome }}</option>
              }
            </select>
          </div>
          <div class="filter-group">
            <label>Stato Pulizia</label>
            <select [(ngModel)]="filtroStato" (change)="applicaFiltri()">
              <option value="">Tutti</option>
              <option value="PULITA">Pulita</option>
              <option value="DA_PULIRE">Da pulire</option>
            </select>
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
        <div class="camere-grid">
          @for (camera of camereFiltrate; track camera.id) {
            <div class="camera-card" [class.da-pulire]="camera.statoPulizia === 'DA_PULIRE'">
              <div class="camera-header">
                <span class="camera-numero">{{ camera.numero }}</span>
                <span class="badge" [ngClass]="getBadgeClass(camera.statoPulizia)">
                  {{ camera.statoPulizia === 'PULITA' ? 'Pulita' : 'Da pulire' }}
                </span>
              </div>
              <div class="camera-body">
                <span class="camera-tipologia">{{ camera.tipologiaNome }}</span>
              </div>
              <div class="camera-actions">
                <button
                  class="btn btn-sm"
                  [class.btn-success]="camera.statoPulizia === 'DA_PULIRE'"
                  [class.btn-warning]="camera.statoPulizia === 'PULITA'"
                  (click)="toggleStatoPulizia(camera)"
                >
                  {{ camera.statoPulizia === 'PULITA' ? 'Segna da pulire' : 'Segna pulita' }}
                </button>
                <button class="btn btn-sm btn-outline" (click)="editCamera(camera)">
                  Modifica
                </button>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              Nessuna camera trovata
            </div>
          }
        </div>

        <div class="results-info">
          {{ camereFiltrate.length }} camere trovate
        </div>
      }

      <!-- Modal Form Camera -->
      @if (showForm) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ editingCamera ? 'Modifica' : 'Nuova' }} Camera</h2>
              <button class="close-btn" (click)="closeForm()">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Numero Camera *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.numero"
                  placeholder="Es. 101, 102..."
                >
              </div>
              <div class="form-group">
                <label>Tipologia *</label>
                @if (tipologie.length === 0) {
                  <div class="no-tipologie-warning">
                    Nessuna tipologia disponibile.
                    <a routerLink="/tipologie">Crea prima una tipologia</a>
                  </div>
                } @else {
                  <select [(ngModel)]="formData.tipologiaId">
                    <option [ngValue]="null">Seleziona...</option>
                    @for (tipologia of tipologie; track tipologia.id) {
                      <option [ngValue]="tipologia.id">{{ tipologia.nome }}</option>
                    }
                  </select>
                }
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeForm()">Annulla</button>
              <button
                class="btn btn-primary"
                (click)="saveCamera()"
                [disabled]="!formData.numero || !formData.tipologiaId"
              >
                {{ editingCamera ? 'Aggiorna' : 'Crea' }}
              </button>
            </div>
          </div>
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
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(250, 112, 154, 0.3);
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
      gap: 0.75rem;
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
    }

    .filter-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #555;
    }

    .filter-group select {
      padding: 0.75rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      min-width: 180px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .filter-group select:focus {
      outline: none;
      border-color: #fa709a;
      box-shadow: 0 0 0 4px rgba(250, 112, 154, 0.15);
    }

    .camere-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .camera-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border-left: 5px solid;
      border-image: linear-gradient(180deg, #11998e, #38ef7d) 1;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .camera-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, transparent 60%);
      border-radius: 0 0 0 80px;
    }

    .camera-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }

    .camera-card.da-pulire {
      border-image: linear-gradient(180deg, #f093fb, #f5576c) 1;
    }

    .camera-card.da-pulire::before {
      background: linear-gradient(135deg, rgba(245, 87, 108, 0.1) 0%, transparent 60%);
    }

    .camera-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .camera-numero {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .camera-body {
      margin-bottom: 1.25rem;
    }

    .camera-tipologia {
      color: #666;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 0.35rem 0.75rem;
      background: #f0f0f0;
      border-radius: 20px;
      display: inline-block;
    }

    .camera-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.4rem 0.9rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-pulita {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
    }

    .badge-da-pulire {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-outline {
      background: white;
      border: 2px solid #667eea;
      color: #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .btn-success {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
    }

    .btn-success:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
    }

    .btn-warning {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
    }

    .btn-warning:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
    }

    .btn-sm {
      padding: 0.5rem 0.9rem;
      font-size: 0.8rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      color: #999;
      padding: 4rem;
      background: white;
      border-radius: 16px;
      font-style: italic;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
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
      border-top: 4px solid #fa709a;
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

    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 20px;
      width: 100%;
      max-width: 450px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 80px rgba(0,0,0,0.3);
      animation: modalSlide 0.3s ease;
    }

    @keyframes modalSlide {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      border-radius: 20px 20px 0 0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: white;
      font-weight: 700;
    }

    .close-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: rotate(90deg);
    }

    .modal-body {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #fa709a;
      box-shadow: 0 0 0 4px rgba(250, 112, 154, 0.15);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem 2rem;
      background: #f8f9fa;
      border-radius: 0 0 20px 20px;
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

      .header-actions {
        flex-wrap: wrap;
        justify-content: center;
      }

      .camere-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CamereListComponent implements OnInit {
  camere: Camera[] = [];
  camereFiltrate: Camera[] = [];
  tipologie: TipologiaCamera[] = [];
  loading = true;
  error = '';

  filtroTipologia = '';
  filtroStato = '';

  showForm = false;
  editingCamera: Camera | null = null;
  formData: Partial<Camera> = { numero: '', tipologiaId: undefined };

  constructor(
    private cameraService: CameraService,
    private tipologiaService: TipologiaCameraService
  ) {}

  ngOnInit(): void {
    this.loadTipologie();
    this.loadCamere();
  }

  loadTipologie(): void {
    this.tipologiaService.getAll().subscribe({
      next: (data) => {
        this.tipologie = data;
      },
      error: (err) => console.error('Errore caricamento tipologie', err)
    });
  }

  loadCamere(): void {
    this.loading = true;
    this.cameraService.getAll().subscribe({
      next: (data) => {
        this.camere = data;
        this.applicaFiltri();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle camere';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applicaFiltri(): void {
    this.camereFiltrate = this.camere.filter(c => {
      const matchTipologia = !this.filtroTipologia || c.tipologiaId === +this.filtroTipologia;
      const matchStato = !this.filtroStato || c.statoPulizia === this.filtroStato;
      return matchTipologia && matchStato;
    });
  }

  getBadgeClass(stato: StatoPulizia | undefined): string {
    return stato === 'PULITA' ? 'badge-pulita' : 'badge-da-pulire';
  }

  toggleStatoPulizia(camera: Camera): void {
    if (!camera.id) return;

    const nuovoStato = camera.statoPulizia === 'PULITA' ? StatoPulizia.DA_PULIRE : StatoPulizia.PULITA;
    this.cameraService.cambiaStatoPulizia(camera.id, nuovoStato).subscribe({
      next: (updated) => {
        const index = this.camere.findIndex(c => c.id === camera.id);
        if (index !== -1) {
          this.camere[index] = updated;
          this.applicaFiltri();
        }
      },
      error: (err) => console.error('Errore cambio stato', err)
    });
  }

  editCamera(camera: Camera): void {
    this.editingCamera = camera;
    this.formData = { ...camera };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingCamera = null;
    this.formData = { numero: '', tipologiaId: undefined };
  }

  saveCamera(): void {
    if (!this.formData.numero || !this.formData.tipologiaId) return;

    const camera: Camera = {
      numero: this.formData.numero,
      tipologiaId: this.formData.tipologiaId
    };

    const request = this.editingCamera
      ? this.cameraService.update(this.editingCamera.id!, camera)
      : this.cameraService.create(camera);

    request.subscribe({
      next: () => {
        this.closeForm();
        this.loadCamere();
      },
      error: (err) => console.error('Errore salvataggio camera', err)
    });
  }
}
