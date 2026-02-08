import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    console.log('AuthGuard - canActivate called for:', state.url);
    console.log('AuthGuard - currentUser:', currentUser);

    if (currentUser) {
      // User is logged in
      console.log('AuthGuard - User authenticated, allowing access');
      return true;
    }

    // Not logged in, redirect to login page
    console.log('AuthGuard - User not authenticated, redirecting to login');
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
