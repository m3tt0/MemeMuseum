import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../_services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isUserAuthenticated()) return true;

  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
