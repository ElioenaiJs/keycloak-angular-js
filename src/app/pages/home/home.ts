// home.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
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
