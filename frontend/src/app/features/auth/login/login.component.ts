import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Gestionale Motel</h1>
        <h2>Accedi</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              [class.error]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
            >
            @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
              <span class="error-message">Username obbligatorio</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <span class="error-message">Password obbligatoria</span>
            }
          </div>

          @if (errorMessage) {
            <div class="error-alert">{{ errorMessage }}</div>
          }

          <button type="submit" [disabled]="loginForm.invalid || isLoading">
            @if (isLoading) {
              Accesso in corso...
            } @else {
              Accedi
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 50%);
      animation: pulse 15s ease-in-out infinite;
    }

    .login-container::after {
      content: '';
      position: absolute;
      bottom: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
      animation: pulse 20s ease-in-out infinite reverse;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: 3rem;
      border-radius: 24px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
      width: 100%;
      max-width: 420px;
      position: relative;
      z-index: 1;
      animation: slideUp 0.6s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h1 {
      text-align: center;
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    h1::after {
      content: ' ✨';
      -webkit-text-fill-color: initial;
    }

    h2 {
      text-align: center;
      color: #888;
      font-weight: 500;
      font-size: 1rem;
      margin-bottom: 2.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 600;
      font-size: 0.9rem;
    }

    input {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
      background: white;
    }

    input.error {
      border-color: #ff6b6b;
      box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.15);
    }

    .error-message {
      color: #ff6b6b;
      font-size: 0.8rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .error-message::before {
      content: '⚠️';
      font-size: 0.75rem;
    }

    .error-alert {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
      color: white;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 500;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
      animation: shake 0.5s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    button {
      width: 100%;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
      margin-top: 1rem;
    }

    button:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
    }

    button:active:not(:disabled) {
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 480px) {
      .login-card {
        margin: 1rem;
        padding: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenziali non valide';
        } else {
          this.errorMessage = 'Errore durante il login. Riprova.';
        }
      }
    });
  }
}
