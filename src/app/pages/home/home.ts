// home.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Página de Inicio</h1>
      
      <div *ngIf="!isLoggedIn()">
        <p>No estás autenticado</p>
        <button (click)="login()">Iniciar Sesión</button>
      </div>

      <div *ngIf="isLoggedIn()">
        <p>¡Bienvenido, {{ username() }}!</p>
        <p>Email: {{ email() }}</p>
        <button (click)="goToProtected()">Ir a página protegida</button>
        <button (click)="logout()">Cerrar Sesión</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    button {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
    }
    button:hover {
      background-color: #0056b3;
    }
  `]
})

export class HomeComponent {
  private keycloak = inject(Keycloak);
  private router = inject(Router);

  isLoggedIn = signal(false);
  username = signal('');
  email = signal('');

  async ngOnInit() {
    this.isLoggedIn.set(this.keycloak.authenticated || false);
    
    if (this.isLoggedIn()) {
      const profile = await this.keycloak.loadUserProfile();
      this.username.set(profile.username || '');
      this.email.set(profile.email || '');
    }
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  goToProtected() {
    this.router.navigate(['/protected']);
  }
}