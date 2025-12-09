// unauthorized.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>⚠️ Acceso No Autorizado</h1>
      <p>No tienes los permisos necesarios para acceder a esta página.</p>
      <button (click)="goHome()">Volver al Inicio</button>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }
    h1 {
      color: #dc3545;
    }
    button {
      margin: 1rem;
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
export class UnauthorizedComponent {
  private router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}