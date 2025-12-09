// protected.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './protected.html',
  styleUrl: './protected.css',
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
