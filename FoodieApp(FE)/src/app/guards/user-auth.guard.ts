import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {

  loggedUser:String;

  constructor(private router: Router, private snackBar:MatSnackBar) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token: string | null = localStorage.getItem('currentUser');
      console.log("token from user guard  = ", token)
      if (!token) {
        console.log("guard says no token");
        this.router.navigate(['/login']);
        this.snackBar.open('You are not logged in. Please login first.', 'Close', {
          duration:4000
        });
        this.router.navigate(['/login']);
        return false;
      }else if(token){
        const role = this.checkRole();
        if(role === 'admin' && (state.url === '/order-history' || state.url === '/favorite' || state.url === '/cart' || state.url === '/user-detail')){
          this.router.navigate(['/home']);
          this.snackBar.open('Access Denied.', 'Close', {
            duration:4000
          });
          return false;
        }else if(token){
          const role = this.checkRole();
        if(role === 'Admin' && state.url === '/user-detail'){
          // this.router.navigate(['/']);
          return false;
        }
      }
      }
      
      return true;
    }

    checkRole(): string | null {
      this.loggedUser = localStorage.getItem('currentUser');
      
      if (this.loggedUser) {
        try {
          const token = JSON.parse(atob(this.loggedUser.split('.')[1])); 
          return token.role || null; 
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
      return null;
    } 

  }
  
