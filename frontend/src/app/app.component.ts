import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;

  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/planning', label: 'Planning', icon: 'calendar' },
    { path: '/prenotazioni', label: 'Prenotazioni', icon: 'bookmark' },
    { path: '/ospiti', label: 'Ospiti', icon: 'users' },
    { path: '/camere', label: 'Camere', icon: 'door' },
    { path: '/tipologie', label: 'Tipologie', icon: 'layers' },
    { path: '/tariffe', label: 'Tariffe', icon: 'euro' },
    { path: '/periodi', label: 'Periodi', icon: 'calendar-range' },
    { path: '/spese', label: 'Spese', icon: 'wallet' },
    { path: '/configurazione', label: 'Configurazione', icon: 'settings' }
  ];

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
