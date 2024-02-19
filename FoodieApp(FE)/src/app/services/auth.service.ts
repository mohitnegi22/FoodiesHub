import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url =  'http://localhost:2222/api/v1'
  private url2 = 'http://localhost:2222/product-app'

  constructor(private http: HttpClient, private snackBar:MatSnackBar, private router:Router) { 
  }
 
//============login-Check===================================
  login(emailId: String, password: String) : Observable<any>{

    
    const data = {
      "emailId": emailId,
      "password": password
     }
     
     return this.http.post(`${this.url}/login` ,data );

     
  }


  logout() {
    localStorage.removeItem('currentUser');
    
    console.log(localStorage.getItem('currentUser'));
    
    this.snackBar.open('Log-out Success!', 'Close', {
      duration: 5000, 
    });
    this.router.navigateByUrl('/login');

  }
//===============SignUP===================================
signup(signupData: any): Observable<any> {
  console.log("Total signup data recived by service = ",signupData);
  return this.http.post(`${this.url}/registerUserFeign`, signupData);
}
generateAndSendOtp(emailId: string): Observable<any> {
  return this.http.post(`${this.url}/generateAndSendOtp`, { emailId });
}

getAllUsers(): Observable<any>{
  return this.http.get(`${this.url}/getAllEmails`);
}

//===============addUserToProductApp================================
  addUserToFooadApp(emailId:String, name:String, city:String, address:String){

    const data = {
          "emailId": emailId,
          "name":name,
          "city":city,
          "address":address
    }
    return this.http.post(`${this.url2}/addUser`, data);
  }
 //===============================================
 getToken(): string | null {
  return localStorage.getItem('currentUser');
}

  //================================================
  isAuthenticated(): boolean {
    const token = localStorage.getItem('currentUser');
    return !!token;
  }

  //=================================================
  adminLogin(id: String, password: String) : Observable<any>{
    const data = {
      "id": id,
      "password": password
    };

     return this.http.post(`${this.url}/admin-login` ,data ); 
  }
}