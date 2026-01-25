import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  OspiteService,
  ComuneService,
  StatoService,
  TipoDocumentoService
} from '../../../core/services';
import {
  Ospite,
  Comune,
  Stato,
  TipoDocumento,
  Sesso
} from '../../../core/models';

@Component({
  selector: 'app-ospite-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">{{ isEdit ? 'Modifica' : 'Nuovo' }} Ospite</h1>
      </div>

      <!-- Avviso duplicati -->
      @if (duplicati.length > 0) {
        <div class="alert alert-warning duplicati-alert">
          <div class="alert-header">
            <strong>Attenzione: possibili duplicati trovati</strong>
          </div>
          <p>Esistono ospiti con dati simili. Vuoi selezionarne uno esistente?</p>
          <div class="duplicati-list">
            @for (dup of duplicati; track dup.id) {
              <div class="duplicato-item" (click)="selezionaDuplicato(dup)">
                <span class="duplicato-nome">{{ dup.cognome }} {{ dup.nome }}</span>
                <span class="duplicato-doc">{{ dup.tipoDocumentoSigla }} {{ dup.numeroDocumento }}</span>
                <span class="duplicato-action">Seleziona</span>
              </div>
            }
          </div>
          <button type="button" class="btn btn-sm btn-secondary" (click)="ignoraDuplicati()">
            Ignora e continua con nuovo ospite
          </button>
        </div>
      }

      <div class="card form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <!-- Sezione Anagrafica -->
          <h3 class="section-title">Dati Anagrafici</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cognome *</label>
              <input
                type="text"
                formControlName="cognome"
                class="form-control"
                (blur)="checkDuplicati()"
              >
              @if (form.get('cognome')?.invalid && form.get('cognome')?.touched) {
                <span class="form-error">Cognome obbligatorio</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Nome *</label>
              <input
                type="text"
                formControlName="nome"
                class="form-control"
                (blur)="checkDuplicati()"
              >
              @if (form.get('nome')?.invalid && form.get('nome')?.touched) {
                <span class="form-error">Nome obbligatorio</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Sesso *</label>
              <select formControlName="sesso" class="form-control">
                <option [ngValue]="null">Seleziona...</option>
                <option value="M">Maschio</option>
                <option value="F">Femmina</option>
              </select>
              @if (form.get('sesso')?.invalid && form.get('sesso')?.touched) {
                <span class="form-error">Sesso obbligatorio</span>
              }
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Data di Nascita *</label>
              <input
                type="date"
                formControlName="dataNascita"
                class="form-control"
              >
              @if (form.get('dataNascita')?.invalid && form.get('dataNascita')?.touched) {
                <span class="form-error">Data di nascita obbligatoria</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Luogo di Nascita *</label>
              <div class="autocomplete-wrapper">
                <input
                  type="text"
                  class="form-control"
                  [value]="luogoNascitaDisplay"
                  (input)="onLuogoNascitaSearch($event)"
                  (focus)="showLuogoNascitaSuggestions = true"
                  placeholder="Cerca comune o stato estero..."
                >
                @if (showLuogoNascitaSuggestions && (comuniNascitaFiltrati.length > 0 || statiNascitaFiltrati.length > 0)) {
                  <div class="autocomplete-dropdown">
                    @if (comuniNascitaFiltrati.length > 0) {
                      <div class="autocomplete-section">
                        <div class="autocomplete-section-title">Comuni italiani</div>
                        @for (comune of comuniNascitaFiltrati; track comune.id) {
                          <div class="autocomplete-item" (mousedown)="selectComuneNascita(comune)">
                            {{ comune.nome }} ({{ comune.provincia }})
                          </div>
                        }
                      </div>
                    }
                    @if (statiNascitaFiltrati.length > 0) {
                      <div class="autocomplete-section">
                        <div class="autocomplete-section-title">Stati esteri</div>
                        @for (stato of statiNascitaFiltrati; track stato.id) {
                          <div class="autocomplete-item" (mousedown)="selectStatoNascita(stato)">
                            {{ stato.nome }}
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
              @if (!form.get('comuneNascitaId')?.value && !form.get('statoNascitaId')?.value && form.touched) {
                <span class="form-error">Luogo di nascita obbligatorio</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Cittadinanza *</label>
              <div class="autocomplete-wrapper">
                <input
                  type="text"
                  class="form-control"
                  [value]="cittadinanzaDisplay"
                  (input)="onCittadinanzaSearch($event)"
                  (focus)="showCittadinanzaSuggestions = true"
                  placeholder="Cerca stato..."
                >
                @if (showCittadinanzaSuggestions && statiCittadinanzaFiltrati.length > 0) {
                  <div class="autocomplete-dropdown">
                    @for (stato of statiCittadinanzaFiltrati; track stato.id) {
                      <div class="autocomplete-item" (mousedown)="selectCittadinanza(stato)">
                        {{ stato.nome }}
                      </div>
                    }
                  </div>
                }
              </div>
              @if (form.get('cittadinanzaId')?.invalid && form.get('cittadinanzaId')?.touched) {
                <span class="form-error">Cittadinanza obbligatoria</span>
              }
            </div>
          </div>

          <!-- Sezione Documento -->
          <h3 class="section-title">Documento di Identità</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tipo Documento *</label>
              <select formControlName="tipoDocumentoId" class="form-control">
                <option [ngValue]="null">Seleziona...</option>
                @for (tipo of tipiDocumento; track tipo.id) {
                  <option [ngValue]="tipo.id">{{ tipo.descrizione }} ({{ tipo.sigla }})</option>
                }
              </select>
              @if (form.get('tipoDocumentoId')?.invalid && form.get('tipoDocumentoId')?.touched) {
                <span class="form-error">Tipo documento obbligatorio</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Numero Documento *</label>
              <input
                type="text"
                formControlName="numeroDocumento"
                class="form-control"
                (blur)="checkDuplicati()"
              >
              @if (form.get('numeroDocumento')?.invalid && form.get('numeroDocumento')?.touched) {
                <span class="form-error">Numero documento obbligatorio</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label">Luogo di Rilascio *</label>
              <div class="autocomplete-wrapper">
                <input
                  type="text"
                  class="form-control"
                  [value]="luogoRilascioDisplay"
                  (input)="onLuogoRilascioSearch($event)"
                  (focus)="showLuogoRilascioSuggestions = true"
                  placeholder="Cerca comune o stato estero..."
                >
                @if (showLuogoRilascioSuggestions && (comuniRilascioFiltrati.length > 0 || statiRilascioFiltrati.length > 0)) {
                  <div class="autocomplete-dropdown">
                    @if (comuniRilascioFiltrati.length > 0) {
                      <div class="autocomplete-section">
                        <div class="autocomplete-section-title">Comuni italiani</div>
                        @for (comune of comuniRilascioFiltrati; track comune.id) {
                          <div class="autocomplete-item" (mousedown)="selectComuneRilascio(comune)">
                            {{ comune.nome }} ({{ comune.provincia }})
                          </div>
                        }
                      </div>
                    }
                    @if (statiRilascioFiltrati.length > 0) {
                      <div class="autocomplete-section">
                        <div class="autocomplete-section-title">Stati esteri</div>
                        @for (stato of statiRilascioFiltrati; track stato.id) {
                          <div class="autocomplete-item" (mousedown)="selectStatoRilascio(stato)">
                            {{ stato.nome }}
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
              @if (!form.get('comuneRilascioId')?.value && !form.get('statoRilascioId')?.value && form.touched) {
                <span class="form-error">Luogo di rilascio obbligatorio</span>
              }
            </div>
          </div>

          <!-- Sezione Contatti -->
          <h3 class="section-title">Contatti</h3>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Telefono</label>
              <input
                type="tel"
                formControlName="telefono"
                class="form-control"
                placeholder="+39 ..."
              >
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                type="email"
                formControlName="email"
                class="form-control"
                placeholder="email@esempio.com"
              >
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <span class="form-error">Formato email non valido</span>
              }
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
              [disabled]="form.invalid || saving"
            >
              @if (saving) {
                Salvataggio...
              } @else {
                {{ isEdit ? 'Aggiorna' : 'Crea' }} Ospite
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
      max-width: 900px;
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

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .form-card {
      padding: 2rem;
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin: 1.5rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
    }

    .section-title:first-of-type {
      margin-top: 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .form-control {
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

    .form-error {
      font-size: 0.75rem;
      color: #dc3545;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
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

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
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

    .alert-warning {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffc107;
    }

    /* Autocomplete styles */
    .autocomplete-wrapper {
      position: relative;
    }

    .autocomplete-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-height: 250px;
      overflow-y: auto;
      z-index: 1000;
    }

    .autocomplete-section {
      padding: 0.5rem 0;
    }

    .autocomplete-section-title {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      background: #f8f9fa;
    }

    .autocomplete-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .autocomplete-item:hover {
      background: #f0f0f0;
    }

    /* Duplicati alert */
    .duplicati-alert {
      margin-bottom: 1.5rem;
    }

    .alert-header {
      margin-bottom: 0.5rem;
    }

    .duplicati-list {
      margin: 1rem 0;
      border: 1px solid #ffc107;
      border-radius: 6px;
      overflow: hidden;
    }

    .duplicato-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: white;
      cursor: pointer;
      transition: background 0.2s;
    }

    .duplicato-item:hover {
      background: #fff8e1;
    }

    .duplicato-item:not(:last-child) {
      border-bottom: 1px solid #eee;
    }

    .duplicato-nome {
      font-weight: 500;
    }

    .duplicato-doc {
      color: #666;
      font-size: 0.875rem;
    }

    .duplicato-action {
      color: #667eea;
      font-weight: 500;
      font-size: 0.875rem;
    }
  `]
})
export class OspiteFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  ospiteId: number | null = null;
  saving = false;
  error = '';

  // Lookup data
  tipiDocumento: TipoDocumento[] = [];

  // Autocomplete comuni/stati nascita
  comuniNascitaFiltrati: Comune[] = [];
  statiNascitaFiltrati: Stato[] = [];
  showLuogoNascitaSuggestions = false;
  luogoNascitaDisplay = '';

  // Autocomplete cittadinanza
  statiCittadinanzaFiltrati: Stato[] = [];
  showCittadinanzaSuggestions = false;
  cittadinanzaDisplay = '';

  // Autocomplete luogo rilascio documento
  comuniRilascioFiltrati: Comune[] = [];
  statiRilascioFiltrati: Stato[] = [];
  showLuogoRilascioSuggestions = false;
  luogoRilascioDisplay = '';

  // Duplicati
  duplicati: Ospite[] = [];
  duplicatiIgnorati = false;

  private searchSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ospiteService: OspiteService,
    private comuneService: ComuneService,
    private statoService: StatoService,
    private tipoDocumentoService: TipoDocumentoService
  ) {
    this.form = this.fb.group({
      cognome: ['', Validators.required],
      nome: ['', Validators.required],
      sesso: [null, Validators.required],
      dataNascita: ['', Validators.required],
      comuneNascitaId: [null],
      statoNascitaId: [null],
      cittadinanzaId: [null, Validators.required],
      tipoDocumentoId: [null, Validators.required],
      numeroDocumento: ['', Validators.required],
      comuneRilascioId: [null],
      statoRilascioId: [null],
      telefono: [''],
      email: ['', Validators.email]
    });
  }

  ngOnInit(): void {
    this.loadTipiDocumento();

    // Check if editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuovo') {
      this.isEdit = true;
      this.ospiteId = +id;
      this.loadOspite();
    }

    // Close dropdowns on click outside
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.autocomplete-wrapper')) {
          this.showLuogoNascitaSuggestions = false;
          this.showCittadinanzaSuggestions = false;
          this.showLuogoRilascioSuggestions = false;
        }
      });
    }, 100);
  }

  loadTipiDocumento(): void {
    this.tipoDocumentoService.getAll().subscribe({
      next: (tipi) => {
        this.tipiDocumento = tipi;
      },
      error: (err) => console.error('Errore caricamento tipi documento', err)
    });
  }

  loadOspite(): void {
    if (!this.ospiteId) return;

    this.ospiteService.getById(this.ospiteId).subscribe({
      next: (ospite) => {
        this.form.patchValue({
          cognome: ospite.cognome,
          nome: ospite.nome,
          sesso: ospite.sesso,
          dataNascita: ospite.dataNascita,
          comuneNascitaId: ospite.comuneNascitaId,
          statoNascitaId: ospite.statoNascitaId,
          cittadinanzaId: ospite.cittadinanzaId,
          tipoDocumentoId: ospite.tipoDocumentoId,
          numeroDocumento: ospite.numeroDocumento,
          comuneRilascioId: ospite.comuneRilascioId,
          statoRilascioId: ospite.statoRilascioId,
          telefono: ospite.telefono,
          email: ospite.email
        });

        // Set display values
        if (ospite.comuneNascitaNome) {
          this.luogoNascitaDisplay = ospite.comuneNascitaNome;
        } else if (ospite.statoNascitaNome) {
          this.luogoNascitaDisplay = ospite.statoNascitaNome;
        }

        if (ospite.cittadinanzaNome) {
          this.cittadinanzaDisplay = ospite.cittadinanzaNome;
        }

        if (ospite.comuneRilascioNome) {
          this.luogoRilascioDisplay = ospite.comuneRilascioNome;
        } else if (ospite.statoRilascioNome) {
          this.luogoRilascioDisplay = ospite.statoRilascioNome;
        }
      },
      error: (err) => {
        this.error = 'Errore nel caricamento dell\'ospite';
        console.error(err);
      }
    });
  }

  // Autocomplete luogo nascita
  onLuogoNascitaSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.luogoNascitaDisplay = value;

    // Reset selections
    this.form.patchValue({ comuneNascitaId: null, statoNascitaId: null });

    if (value.length < 2) {
      this.comuniNascitaFiltrati = [];
      this.statiNascitaFiltrati = [];
      return;
    }

    // Search comuni
    this.comuneService.search(value).subscribe({
      next: (comuni) => {
        this.comuniNascitaFiltrati = comuni.slice(0, 10);
      }
    });

    // Search stati
    this.statoService.search(value).subscribe({
      next: (stati) => {
        this.statiNascitaFiltrati = stati.slice(0, 5);
      }
    });
  }

  selectComuneNascita(comune: Comune): void {
    this.form.patchValue({
      comuneNascitaId: comune.id,
      statoNascitaId: null
    });
    this.luogoNascitaDisplay = `${comune.nome} (${comune.provincia})`;
    this.showLuogoNascitaSuggestions = false;
    this.comuniNascitaFiltrati = [];
    this.statiNascitaFiltrati = [];
  }

  selectStatoNascita(stato: Stato): void {
    this.form.patchValue({
      statoNascitaId: stato.id,
      comuneNascitaId: null
    });
    this.luogoNascitaDisplay = stato.nome;
    this.showLuogoNascitaSuggestions = false;
    this.comuniNascitaFiltrati = [];
    this.statiNascitaFiltrati = [];
  }

  // Autocomplete cittadinanza
  onCittadinanzaSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.cittadinanzaDisplay = value;

    this.form.patchValue({ cittadinanzaId: null });

    if (value.length < 2) {
      this.statiCittadinanzaFiltrati = [];
      return;
    }

    this.statoService.search(value).subscribe({
      next: (stati) => {
        this.statiCittadinanzaFiltrati = stati.slice(0, 10);
      }
    });
  }

  selectCittadinanza(stato: Stato): void {
    this.form.patchValue({ cittadinanzaId: stato.id });
    this.cittadinanzaDisplay = stato.nome;
    this.showCittadinanzaSuggestions = false;
    this.statiCittadinanzaFiltrati = [];
  }

  // Autocomplete luogo rilascio
  onLuogoRilascioSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.luogoRilascioDisplay = value;

    // Reset selections when user types
    this.form.patchValue({ comuneRilascioId: null, statoRilascioId: null });

    if (value.length < 2) {
      this.comuniRilascioFiltrati = [];
      this.statiRilascioFiltrati = [];
      return;
    }

    // Search comuni
    this.comuneService.search(value).subscribe({
      next: (comuni) => {
        this.comuniRilascioFiltrati = comuni.slice(0, 10);
      }
    });

    // Search stati
    this.statoService.search(value).subscribe({
      next: (stati) => {
        this.statiRilascioFiltrati = stati.slice(0, 5);
      }
    });
  }

  selectComuneRilascio(comune: Comune): void {
    this.form.patchValue({
      comuneRilascioId: comune.id,
      statoRilascioId: null
    });
    this.luogoRilascioDisplay = `${comune.nome} (${comune.provincia})`;
    this.showLuogoRilascioSuggestions = false;
    this.comuniRilascioFiltrati = [];
    this.statiRilascioFiltrati = [];
  }

  selectStatoRilascio(stato: Stato): void {
    this.form.patchValue({
      statoRilascioId: stato.id,
      comuneRilascioId: null
    });
    this.luogoRilascioDisplay = stato.nome;
    this.showLuogoRilascioSuggestions = false;
    this.comuniRilascioFiltrati = [];
    this.statiRilascioFiltrati = [];
  }

  // Controllo duplicati
  checkDuplicati(): void {
    if (this.isEdit || this.duplicatiIgnorati) return;

    const nome = this.form.get('nome')?.value;
    const cognome = this.form.get('cognome')?.value;
    const documento = this.form.get('numeroDocumento')?.value;

    if (!nome && !cognome && !documento) return;

    this.ospiteService.findDuplicati(nome || '', cognome || '', documento).subscribe({
      next: (duplicati) => {
        this.duplicati = duplicati;
      },
      error: (err) => console.error('Errore ricerca duplicati', err)
    });
  }

  selezionaDuplicato(ospite: Ospite): void {
    // Navigate to edit the existing guest
    this.router.navigate(['/ospiti', ospite.id, 'modifica']);
  }

  ignoraDuplicati(): void {
    this.duplicatiIgnorati = true;
    this.duplicati = [];
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    // Validate luogo nascita
    if (!this.form.get('comuneNascitaId')?.value && !this.form.get('statoNascitaId')?.value) {
      this.error = 'Seleziona un luogo di nascita dalla lista';
      return;
    }

    // Validate luogo rilascio
    if (!this.form.get('comuneRilascioId')?.value && !this.form.get('statoRilascioId')?.value) {
      this.error = 'Seleziona un luogo di rilascio dalla lista';
      return;
    }

    this.saving = true;
    this.error = '';

    const ospite: Ospite = {
      ...this.form.value
    };

    const request = this.isEdit
      ? this.ospiteService.update(this.ospiteId!, ospite)
      : this.ospiteService.create(ospite);

    request.subscribe({
      next: (result) => {
        this.router.navigate(['/ospiti', result.id]);
      },
      error: (err) => {
        this.error = err.error?.message || 'Errore nel salvataggio';
        this.saving = false;
        console.error(err);
      }
    });
  }

  annulla(): void {
    this.router.navigate(['/ospiti']);
  }
}
