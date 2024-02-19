import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserDetail } from '../models/userDetails';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  url = "http://localhost:2222/food-app";

  constructor(private http:HttpClient, private authService:AuthService) { }

  getAllAccounts(): Observable<UserDetail[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    })
    console.log(headers);
    return this.http.get<any[]>(`${this.url}/getAccounts` , {headers});
  }

  deleteAccount(emailId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    })
    
    return this.http.delete(`${this.url}/deleteAccount`, { headers, body: { emailId } });
  }
}