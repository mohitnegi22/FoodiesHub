import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  loggedUser:String;

  constructor(private snackBar:MatSnackBar,private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token: string | null = localStorage.getItem('currentUser');
      
      if(token){
        const role = this.checkRole();
        if(role === 'User' && state.url === '/login'){
          this.snackBar.open('Already loggedIn', 'Close', { duration:4000});
          this.router.navigate(['/home'])
          return false;
        }else if(role === 'User' && state.url === '/admin-login'){
          this.router.navigate(['/home']);
          return false;
        }
        
        
        if(role === 'admin' && state.url === '/admin-login'){
          this.snackBar.open('Already loggedIn', 'Close', { duration:4000});
          this.router.navigate(['/orders']);
          return false;
        }else{
          this.router.navigate(['/orders']);
        }
      }
      return true;
    }
  //============================================================================
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
