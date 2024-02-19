import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  
  private apiUrl = 'http://localhost:2222/restaurants'; 
  private apiUrl3 = 'http://localhost:2222'; 
  private apiUrl2 = 'http://localhost:2222/food-app/admin';
  private apiUrl4 = 'http://localhost:2222'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  getRestaurants(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getRestaurantDetails(restaurantId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${restaurantId}`);
  }

  getAdmminRestaurantDetails(restaurantId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken(), 
    });
    return this.http.get<any>(`${this.apiUrl3}/restaurants/${restaurantId}`, {headers});
  }

  getRestaurantsByStateAndCity(state: string, city: string): Observable<any[]> {
    const token = localStorage.getItem('currentUser');
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log("Service: ", headers);

    // Adjust the API endpoint based on your backend implementation
    return this.http.get<any[]>(`${this.apiUrl3}/restaurants?state=${state}&city=${city}`, { headers });
  }

  getStatesAndCities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl4}/states`).pipe(
      map((data) => {
        const statesArray = data.map((item) => JSON.parse(item));
        const distinctStatesArray = Array.from(new Set(statesArray.map((item) => item.state)));
  
        console.log('Distinct States:', distinctStatesArray);
        console.log('States and Cities:', statesArray);
  
        return distinctStatesArray;
      })
    );
  }
  
  getCitiesByState(state: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl4}/cities/${state}`).pipe(
      map((citiesArray) => {
        // Parse each JSON string and extract the city name
        const uniqueCities = new Set(
          citiesArray.map((cityString) => {
            const cityObject = JSON.parse(cityString);
            return cityObject.city;
          })
        );
  
        // Convert the Set back to an array
        return Array.from(uniqueCities);
      }),
      tap((citiesArray) => {
        console.log('Cities for State:', state, citiesArray);
      })
    );
  }
  
  getAllCitiesByState(state: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl4}/cities/${state}/all`).pipe(
        map((citiesArray) => {
            // Parse each JSON string and extract the city name
            const uniqueCities = new Set(
                citiesArray.map((cityString) => {
                    const cityObject = JSON.parse(cityString);
                    return cityObject.city;
                })
            );

            // Convert the Set back to an array
            return Array.from(uniqueCities);
        }),
        tap((citiesArray) => {
            console.log('All Cities for State:', state, citiesArray);
        })
    );

}

  
  getRestaurantsByState(state: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurants?state=${state}`);
  } 
  
  
  
  
  
  
  
  
}