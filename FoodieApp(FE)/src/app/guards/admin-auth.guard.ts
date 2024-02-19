import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  adminUser:String;
  constructor( private snackBar:MatSnackBar,private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//=======================admin guard=========================================
const token: string | null = localStorage.getItem('currentUser');
console.log("token from Admin guard  = ", token)

if(token !== null){
  const role = this.checkRole();
  console.log("role is " , role);
  if(role === 'admin'){
    this.snackBar.open('Welcome admin', 'Close', { duration:4000});
    return true;
  }else{
    console.log("guard says not admin");
    this.snackBar.open('Either you are not authorized or not logged in.', 'Close', { duration:4000});
    this.router.navigate(['/admin-login']);
    return false;
  }
}
this.snackBar.open('Please login first.', 'Close', { duration:4000});
this.router.navigate(['/admin-login']);

return false;
}


//============================================================================
checkRole(): string | null {
this.adminUser = localStorage.getItem('currentUser');
if (this.adminUser) {
try {
const token = JSON.parse(atob(this.adminUser.split('.')[1])); 
return token.role || null; 
} catch (error) {
console.error('Error decoding token:', error);
}
}
return null;
}
  
}
