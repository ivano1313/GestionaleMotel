import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirect root to dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // Login (pubblico)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  // Planning
  {
    path: 'planning',
    loadComponent: () => import('./features/planning/planning.component').then(m => m.PlanningComponent),
    canActivate: [authGuard]
  },

  // Prenotazioni
  {
    path: 'prenotazioni',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/prenotazioni/prenotazioni-list/prenotazioni-list.component').then(m => m.PrenotazioniListComponent)
      },
      {
        path: 'nuova',
        loadComponent: () => import('./features/prenotazioni/prenotazione-form/prenotazione-form.component').then(m => m.PrenotazioneFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/prenotazioni/prenotazione-detail/prenotazione-detail.component').then(m => m.PrenotazioneDetailComponent)
      },
      {
        path: ':id/modifica',
        loadComponent: () => import('./features/prenotazioni/prenotazione-form/prenotazione-form.component').then(m => m.PrenotazioneFormComponent)
      }
    ]
  },

  // Ospiti
  {
    path: 'ospiti',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/ospiti/ospiti-list/ospiti-list.component').then(m => m.OspitiListComponent)
      },
      {
        path: 'nuovo',
        loadComponent: () => import('./features/ospiti/ospite-form/ospite-form.component').then(m => m.OspiteFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/ospiti/ospite-detail/ospite-detail.component').then(m => m.OspiteDetailComponent)
      },
      {
        path: ':id/modifica',
        loadComponent: () => import('./features/ospiti/ospite-form/ospite-form.component').then(m => m.OspiteFormComponent)
      }
    ]
  },

  // Camere
  {
    path: 'camere',
    loadComponent: () => import('./features/camere/camere-list/camere-list.component').then(m => m.CamereListComponent),
    canActivate: [authGuard]
  },

  // Tipologie
  {
    path: 'tipologie',
    loadComponent: () => import('./features/camere/tipologie-list/tipologie-list.component').then(m => m.TipologieListComponent),
    canActivate: [authGuard]
  },

  // Tariffe
  {
    path: 'tariffe',
    loadComponent: () => import('./features/tariffe/tariffe-list/tariffe-list.component').then(m => m.TariffeListComponent),
    canActivate: [authGuard]
  },

  // Periodi tariffari
  {
    path: 'periodi',
    loadComponent: () => import('./features/tariffe/periodi-list/periodi-list.component').then(m => m.PeriodiListComponent),
    canActivate: [authGuard]
  },

  // Configurazione
  {
    path: 'configurazione',
    loadComponent: () => import('./features/configurazione/configurazione.component').then(m => m.ConfigurazioneComponent),
    canActivate: [authGuard]
  },

  // Spese
  {
    path: 'spese',
    loadComponent: () => import('./features/spese/spese-list/spese-list.component').then(m => m.SpeseListComponent),
    canActivate: [authGuard]
  },

  // Categorie Spesa
  {
    path: 'categorie-spesa',
    loadComponent: () => import('./features/spese/categorie-spesa-list/categorie-spesa-list.component').then(m => m.CategorieSpesaListComponent),
    canActivate: [authGuard]
  },

  // Report Incassi
  {
    path: 'report-incassi',
    loadComponent: () => import('./features/report/report-incassi.component').then(m => m.ReportIncassiComponent),
    canActivate: [authGuard]
  },

  // Bilancio
  {
    path: 'bilancio',
    loadComponent: () => import('./features/report/bilancio.component').then(m => m.BilancioComponent),
    canActivate: [authGuard]
  },

  // Alloggiati Web (Polizia di Stato)
  {
    path: 'alloggiati',
    loadComponent: () => import('./features/alloggiati/alloggiati.component').then(m => m.AlloggiatiComponent),
    canActivate: [authGuard]
  },

  // Fallback: redirect a dashboard
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
