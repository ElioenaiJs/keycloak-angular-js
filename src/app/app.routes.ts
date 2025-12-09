import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'protected',
    loadComponent: () => import('./pages/protected/protected').then((m) => m.ProtectedComponent),
    canActivate: [authGuard],
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized').then((m) => m.UnauthorizedComponent),
  },
];
