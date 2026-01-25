import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrenotazioneService, CameraService, TariffaService } from '../../../core/services';
import { Camera, Prenotazione } from '../../../core/models';

@Component({
  selector: 'app-prenotazione-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">{{ isEdit ? 'Modifica' : 'Nuova' }} Prenotazione</h1>
      </div>

      <div class="card form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Camera *</label>
              <select formControlName="cameraId" class="form-control" (change)="onCameraChange()">
                <option [ngValue]="null">Seleziona camera...</option>
                @for (camera of camereDisponibili; track camera.id) {
                  <option [ngValue]="camera.id">
                    {{ camera.numero }} - {{ camera.tipologiaNome }}
                  </option>
                }
              </select>
              @if (form.get('cameraId')?.invalid && form.get('cameraId')?.touched) {
                <span class="form-error">Camera obbligatoria</span>
              }
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Check-in *</label>
              <input
                type="date"
                formControlName="dataCheckin"
                class="form-control"
                (change)="onDateChange()"
              >
              @if (form.get('dataCheckin')?.invalid && form.get('dataCheckin')?.touched) {
                <span class="form-error">Data check-in obbligatoria</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Check-out *</label>
              <input
                type="date"
                formControlName="dataCheckout"
                class="form-control"
                (change)="onDateChange()"
              >
              @if (form.get('dataCheckout')?.invalid && form.get('dataCheckout')?.touched) {
                <span class="form-error">Data check-out obbligatoria</span>
              }
              @if (dateError) {
                <span class="form-error">{{ dateError }}</span>
              }
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Prezzo Totale (€) *</label>
              <div class="price-input-wrapper">
                <input
                  type="number"
                  formControlName="prezzoTotale"
                  class="form-control"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                >
                <button
                  type="button"
                  class="btn btn-sm btn-outline calc-btn"
                  (click)="calcolaPrezzo()"
                  [disabled]="calcolandoPrezzo || !tipologiaSelezionata"
                  title="Calcola automaticamente in base alle tariffe"
                >
                  @if (calcolandoPrezzo) {
                    ...
                  } @else {
                    Calcola
                  }
                </button>
              </div>
              @if (form.get('prezzoTotale')?.invalid && form.get('prezzoTotale')?.touched) {
                <span class="form-error">Prezzo obbligatorio</span>
              }
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label class="form-label">Note</label>
              <textarea
                formControlName="note"
                class="form-control"
                rows="3"
                placeholder="Note aggiuntive..."
              ></textarea>
            </div>
          </div>

          @if (error) {
            <div class="alert alert-error">{{ error }}</div>
          }

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="annulla()">
              Annulla
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || saving || dateError"
            >
              @if (saving) {
                Salvataggio...
              } @else {
                {{ isEdit ? 'Aggiorna' : 'Crea' }} Prenotazione
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
      max-width: 800px;
    }

    .form-card {
      padding: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .price-input-wrapper {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .price-input-wrapper input {
      flex: 1;
    }

    .calc-btn {
      white-space: nowrap;
      padding: 0.5rem 1rem;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
    }

    .calc-btn:hover:not(:disabled) {
      background: #e0e0e0;
    }

    .calc-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
  `]
})
export class PrenotazioneFormComponent implements OnInit {
  form: FormGroup;
  camereDisponibili: Camera[] = [];
  isEdit = false;
  prenotazioneId: number | null = null;
  saving = false;
  error = '';
  dateError = '';
  calcolandoPrezzo = false;
  tipologiaSelezionata: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private prenotazioneService: PrenotazioneService,
    private cameraService: CameraService,
    private tariffaService: TariffaService
  ) {
    this.form = this.fb.group({
      cameraId: [null, Validators.required],
      dataCheckin: ['', Validators.required],
      dataCheckout: ['', Validators.required],
      prezzoTotale: [null, [Validators.required, Validators.min(0)]],
      note: ['']
    });
  }

  ngOnInit(): void {
    // Check for query params (from planning)
    this.route.queryParams.subscribe(params => {
      if (params['cameraId']) {
        this.form.patchValue({ cameraId: +params['cameraId'] });
      }
      if (params['checkIn']) {
        this.form.patchValue({ dataCheckin: params['checkIn'] });
      }
    });

    // Check if editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuova') {
      this.isEdit = true;
      this.prenotazioneId = +id;
      this.loadPrenotazione();
    }

    this.loadCamere();
  }

  loadPrenotazione(): void {
    if (!this.prenotazioneId) return;

    this.prenotazioneService.getById(this.prenotazioneId).subscribe({
      next: (prenotazione) => {
        this.form.patchValue({
          cameraId: prenotazione.cameraId,
          dataCheckin: prenotazione.dataCheckin,
          dataCheckout: prenotazione.dataCheckout,
          prezzoTotale: prenotazione.prezzoTotale,
          note: prenotazione.note
        });
      },
      error: (err) => {
        this.error = 'Errore nel caricamento della prenotazione';
        console.error(err);
      }
    });
  }

  loadCamere(): void {
    this.cameraService.getAll().subscribe({
      next: (camere) => {
        this.camereDisponibili = camere;
      },
      error: (err) => {
        console.error('Errore caricamento camere', err);
      }
    });
  }

  onCameraChange(): void {
    const cameraId = this.form.get('cameraId')?.value;
    const camera = this.camereDisponibili.find(c => c.id === cameraId);
    if (camera) {
      this.tipologiaSelezionata = camera.tipologiaId;
      this.calcolaPrezzo();
    }
  }

  onDateChange(): void {
    // Validazione date in tempo reale
    const checkIn = this.form.get('dataCheckin')?.value;
    const checkOut = this.form.get('dataCheckout')?.value;

    if (checkIn && checkOut && checkOut <= checkIn) {
      this.dateError = 'Check-out deve essere successivo a check-in';
    } else {
      this.dateError = '';
    }

    this.calcolaPrezzo();
  }

  calcolaPrezzo(): void {
    const checkIn = this.form.get('dataCheckin')?.value;
    const checkOut = this.form.get('dataCheckout')?.value;

    if (!this.tipologiaSelezionata || !checkIn || !checkOut) {
      return;
    }

    this.calcolandoPrezzo = true;
    this.tariffaService.calcolaPrezzo(this.tipologiaSelezionata, checkIn, checkOut).subscribe({
      next: (prezzo) => {
        this.form.patchValue({ prezzoTotale: prezzo });
        this.calcolandoPrezzo = false;
      },
      error: (err) => {
        console.error('Errore calcolo prezzo', err);
        this.calcolandoPrezzo = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    // Validazione: checkout deve essere successivo a checkin
    const checkIn = this.form.get('dataCheckin')?.value;
    const checkOut = this.form.get('dataCheckout')?.value;
    if (checkIn && checkOut && checkOut <= checkIn) {
      this.error = 'La data di check-out deve essere successiva alla data di check-in';
      return;
    }

    this.saving = true;
    this.error = '';

    const prenotazione: Prenotazione = {
      ...this.form.value
    };

    const request = this.isEdit
      ? this.prenotazioneService.update(this.prenotazioneId!, prenotazione)
      : this.prenotazioneService.create(prenotazione);

    request.subscribe({
      next: (result) => {
        this.router.navigate(['/prenotazioni', result.id]);
      },
      error: (err) => {
        this.error = err.error?.message || 'Errore nel salvataggio';
        this.saving = false;
        console.error(err);
      }
    });
  }

  annulla(): void {
    this.router.navigate(['/prenotazioni']);
  }
}
