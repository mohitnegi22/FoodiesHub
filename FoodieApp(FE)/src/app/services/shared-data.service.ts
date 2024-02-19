import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private restaurantDataSubject = new BehaviorSubject<any>(null);
  restaurantData$ = this.restaurantDataSubject.asObservable();

  constructor() {
    const storedData = localStorage.getItem('restaurantData');
    if (storedData) {
      this.restaurantDataSubject.next(JSON.parse(storedData));
    }
  }

  setRestaurantData(data: any) {
    this.restaurantDataSubject.next(data);
    localStorage.setItem('restaurantData', JSON.stringify(data));
  }
}
