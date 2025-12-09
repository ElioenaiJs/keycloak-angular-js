import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { createAuthGuard, AuthGuardData } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;
  const router = inject(Router);

  // Si NO está autenticado, redirige al login con prompt
  if (!authenticated) {
    await authData.keycloak.login({
      redirectUri: window.location.origin + state.url,
      prompt: 'login'
    });
    return false;
  }

  // Verificar roles si se especifican en la ruta
  const requiredRoles: string[] = route.data['roles'] || [];
  
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      grantedRoles.realmRoles.includes(role)
    );

    if (!hasRequiredRole) {
      return router.parseUrl('/unauthorized');
    }
  }

  return true;
};

export const authGuard = createAuthGuard(isAccessAllowed);