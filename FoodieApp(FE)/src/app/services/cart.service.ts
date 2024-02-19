import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  AppBaseUrl = "http://localhost:2222/food-app";

  constructor (private httpClient: HttpClient) { }
  private selectedRestaurantSubject = new Subject<string>();
  selectedRestaurant$ = this.selectedRestaurantSubject.asObservable();

  private cartCountSubject = new Subject<number>();
  cartCount$ = this.cartCountSubject.asObservable();

  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();
  updateCartItemCount(count: number) {
    this.cartItemCount.next(count);
  }
  setSelectedRestaurant(restaurantName: string) {
    this.selectedRestaurantSubject.next(restaurantName);
  }
  updateCartCount(count: number) {
    // Broadcast the updated count to subscribers
    this.cartCountSubject.next(count);
  }

  addProductToCart(item: any) {
    const token = localStorage.getItem('currentUser');
    const headers = { 'Authorization': `Bearer ${token}` };
  
  
    item.restaurantId = item.restaurantId;
    item.restaurantName = item.restaurantName;
  
    console.log("Service: ", headers);
    return this.httpClient.post(`${this.AppBaseUrl}/addProductToCart`, item, { headers });
  }
  
  addProductToCartt(item: any) {
    const token = localStorage.getItem('currentUser');
    const headers = { 'Authorization': `Bearer ${token}` };

  
    item.restaurantId = item.restaurantId;
    item.restaurantName = item.restaurantName;

    console.log("Service: ", headers);
    return this.httpClient.post(`${this.AppBaseUrl}/addProductToCartt`, item, { headers });
}



  decreaseQuantityAndPrice(item: any){
    const token = localStorage.getItem('currentUser');
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log("Service: ",headers);
    return this.httpClient.post(`${this.AppBaseUrl}/decrease`, item, { headers });
  }

  removeProductFromCart(item: any): Observable<any> {
    const token = localStorage.getItem('currentUser');
    const headers = { 'Authorization': `Bearer ${token}` };
  
    const options = {
      headers: new HttpHeaders(headers),
      body: item
    };
  
    return this.httpClient.delete(`${this.AppBaseUrl}/removeProductFromCart`, options);
  }


  clearCart(): Observable<any> {
    const token = localStorage.getItem('currentUser');
    const headers = { 'Authorization': `Bearer ${token}` };
    const options = { headers };
  
    
    return this.httpClient.delete(`${this.AppBaseUrl}/clearCart`, options);
  }
  
  
}
