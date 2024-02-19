import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'http://localhost:2222';

  constructor(private http: HttpClient) {}


getRestaurantMenu(restaurantId: string): Observable<any[]> {
  const url = `${this.apiUrl}/restaurants/${restaurantId}/menu`;
  const headers = {
    Authorization: 'Bearer ' + localStorage.getItem('currentUser'),
  };
  return this.http.get<any[]>(url, { headers });
}



  addDishToMenu(restaurantId: string, dish: any): Observable<any[]> {
    const url = `${this.apiUrl}/restaurants/${restaurantId}/menu`;
    return this.http.post<any[]>(url, dish).pipe(
      catchError((error) => {
        console.error('Error adding dish:', error);
        throw error; // Rethrow the error to propagate it to the component
      })
    );
  }
  

  
  removeDishFromMenu(restaurantId: string, dishId: string): Observable<any[]> {
    const url = `${this.apiUrl}/restaurants/${restaurantId}/menu/${dishId}`;
    return this.http.delete<any[]>(url);
  }

  
  updateDishInMenu(restaurantId: string, dishId: string, updatedDish: any): Observable<any[]> {
    const url = `${this.apiUrl}/restaurants/${restaurantId}/menu/${dishId}`;
    return this.http.put<any[]>(url, updatedDish);
  }
}
