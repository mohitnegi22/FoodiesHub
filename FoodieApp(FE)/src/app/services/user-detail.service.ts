import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserDetail } from '../models/userDetails';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  private authappUrl =  'http://localhost:2222/api/v1'
  public baseUrl = 'http://localhost:2222/food-app'

  constructor(private http:HttpClient ,private authService: AuthService) { }
  
  getUserDetails(): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken(), 
    });
    console.log(headers);
    return this.http.get(`${this.baseUrl}/getUserDetails`, {headers});
  }

  getUserDetailsForImage(): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken(), 
    });
    console.log(headers);
    return this.http.get(`${this.baseUrl}/getUserDetailsForImage`, {headers});
  }

  updateUserDetails(userDetails: UserDetail): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.baseUrl}/updateUserDetails`, userDetails, { headers });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken(),
    });
  }

  forgotPasswordOTP(emailId: string): Observable<any> {
    return this.http.post(`${this.authappUrl}/forgotPasswordOTP`, { emailId });
  }

  verifyPasswordOTP(emailId:string, otp:number): Observable<any>{
    return this.http.post(`${this.authappUrl}/verifyPasswordOTP`, {emailId,otp});
  }

  changePassword(emailId: string, password:string ): Observable<any>{
    return this.http.put(`${this.authappUrl}/changePassword`, {emailId,password});
  }

  uploadProfileImage(emailId: string, file: File): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken(),
    });

    const formData: FormData = new FormData();
    formData.append('emailId', emailId);
    formData.append('profileImage', file, file.name);

    return this.http.post(`${this.baseUrl}/upload-profile-image`, formData,{headers});
  }

  uploadSignUpProfileImage(emailId: string, profileImage: File): Observable<any> {
    const formData = new FormData();
    formData.append('emailId', emailId);
    formData.append('profileImage', profileImage);
  
    return this.http.post<any>(`${this.baseUrl}/uploadSignUpProfileImage`, formData);
  }
}