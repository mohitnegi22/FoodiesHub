import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {
  
  constructor(private http: HttpClient) {

	}
  
	createOrder(order: {
		emailId: any;
		restaurantName: any;
		items: any;
		totalAmount: any;
		fullAddress: any;
		city: any;
		state: any;
		zipCode: any;
	}
	): Observable<any> {
		return this.http.post('http://localhost:2222/pg/createOrder', order, httpOptions);
	  }

}