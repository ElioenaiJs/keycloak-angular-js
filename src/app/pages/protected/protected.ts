// protected.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Página Protegida</h1>
      <p>Esta página solo es accesible si estás autenticado</p>
      
      <div class="user-info">
        <h3>Información del Usuario:</h3>
        <p><strong>Usuario:</strong> {{ username() }}</p>
        <p><strong>Email:</strong> {{ email() }}</p>
        <p><strong>Roles:</strong> {{ roles().join(', ') || 'Sin roles' }}</p>
        <p><strong>Token:</strong> {{ tokenPreview() }}</p>
      </div>

      <button (click)="goHome()">Volver al Inicio</button>
      <button (click)="logout()">Cerrar Sesión</button>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    .user-info {
      background: #f0f0f0;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
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
export class ProtectedComponent {
  private keycloak = inject(Keycloak);
  private router = inject(Router);

  username = signal('');
  email = signal('');
  roles = signal<string[]>([]);
  tokenPreview = signal('');

  async ngOnInit() {
    const profile = await this.keycloak.loadUserProfile();
    this.username.set(profile.username || '');
    this.email.set(profile.email || '');
    
    // Obtener roles
    const realmRoles = this.keycloak.realmAccess?.roles || [];
    this.roles.set(realmRoles);
    
    // Mostrar preview del token
    const token = this.keycloak.token;
    if (token) {
      this.tokenPreview.set(token.substring(0, 50) + '...');
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }
}