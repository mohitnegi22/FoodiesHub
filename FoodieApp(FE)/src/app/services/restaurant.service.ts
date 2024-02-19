import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { Feedback } from '../models/feedback';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private foodAppUrl = 'http://localhost:2222/food-app'
  private foodAppUrl2 = 'http://localhost:2222'
  private apiUrl = 'http://localhost:2222/restaurants';

  constructor(private http: HttpClient) {}


  addToFavorites(restaurantId: string): Observable<any> {
    const token = localStorage.getItem('currentUser');
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log("Service: ",headers);
    return this.http.post(`${this.foodAppUrl}/addToFavorites/${restaurantId}`, {}, { headers });
  }

  removeFromFavorites(restaurantId: string): Observable<any> {
    const token = localStorage.getItem('currentUser');
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log("Service: ", headers);
    
    return this.http.post(`${this.foodAppUrl}/removeFromFavorites/${restaurantId}`, {}, { headers })
      .pipe(
        tap(response => console.log('Remove from favorites response:', response)),
        catchError(error => {
          console.error('Error removing from favorites:', error);
          throw error;
        })
      );
  }
  
  getRestaurantsByStateAndCity(state: string, city: string): Observable<any[]> {
    const token = localStorage.getItem('currentUser');
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log("Service: ", headers);

    // Adjust the API endpoint based on your backend implementation
    return this.http.get<any[]>(`${this.foodAppUrl2}/restaurants?state=${state}&city=${city}`, { headers });
  }

  submitFeedback(feedback: Feedback): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    console.log("service recived feedback = " + feedback);
    return this.http.post(`${this.foodAppUrl}/submitFeedback`, feedback, { headers });
  }

}