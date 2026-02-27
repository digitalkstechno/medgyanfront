import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const isLoggedIn = !!token && !!userJson;

  // ✅ NOT LOGGED IN
  if (!isLoggedIn) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // ✅ SUPER ADMIN CHECK (since your backend uses isSuperAdmin)
  const requiredRole = route.data?.['role'];

  if (requiredRole === 'superadmin') {
    try {
      const user = JSON.parse(userJson!);

      if (!user?.isSuperAdmin) {
        router.navigate(['/login']);
        return false;
      }
    } catch {
      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
