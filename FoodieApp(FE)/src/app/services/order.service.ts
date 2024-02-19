import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:2222/orders';

  constructor(private http: HttpClient) { }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, order);
  }

  getUserOrders(emailId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${emailId}`);
  }

  getRestaurantOrders(restaurantName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/restaurant/${restaurantName}`);
  }
  
  getOrdersByRazorpayOrderId(razorpayOrderId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/razorpayOrderId/${razorpayOrderId}`);
}

getOrdersByRazorpayPaymentId(razorpayPaymentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/razorpayPaymentId/${razorpayPaymentId}`);
}

updateAdminStatus(orderId: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/update-admin-status/${orderId}`, {});
}


verifyRazorpayPayment(response: any, orderResponse: any): Observable<any> {
  const verificationData = {
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_signature: response.razorpay_signature,
    order_id: orderResponse.razorpayOrderId,
    amount: orderResponse.amount,
    currency: 'INR', // Change based on your currency
  };

  // Make a request to your backend for verification
  return this.http.post<any>('YOUR_BACKEND_VERIFY_PAYMENT_ENDPOINT', verificationData);
}

}