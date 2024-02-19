import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DeliveryService } from '../services/delivery.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-restaurant-orders',
  templateUrl: './restaurant-orders.component.html',
  styleUrls: ['./restaurant-orders.component.css']
})
export class RestaurantOrdersComponent {
  adminUser: String;
   restaurantDetails: any = {};
   restaurantOrders: any[] = [];
  
    constructor(private orderService: OrderService, private snackBar:MatSnackBar, private router:Router, public authService:AuthService, private deliveryService:DeliveryService){}
  
    ngOnInit(): void {
      this.fetchRestauntDetails();
      console.log("id of restaurant is", this.extractRestaurantId() );
    }
    
    navigateToDishes(): void {
      const restaurantId = this.extractRestaurantId();
      if (restaurantId) {
        this.router.navigate(['/dishes', restaurantId]);
      } else {
        console.error('Restaurant ID not found.');
      }
    }
    
    fetchRestauntDetails(){
      const restaurantId = this.extractRestaurantId();
      this.deliveryService.getAdmminRestaurantDetails(restaurantId).subscribe(
        (response)=>{
          this.restaurantDetails = response;
          console.log('Restaurant details:', response);
          this.fetchOrders();
        },
        (error)=>{
          console.log(error);
          
          if (error.status === 401) {
            this.router.navigate(['/admin-login'])
            this.snackBar.open('You are not authorized. Please log in.', 'OK', {
              duration: 4000,
            });
          }else {
            this.snackBar.open('An error occurred. Please try again later.', 'OK', {
              duration: 4000, 
            });
          }
        }
      )
    }
  
  
    extractRestaurantId(): string | null {
      this.adminUser = localStorage.getItem('currentUser');
  
      if (this.adminUser) {
        try {
          const tokenPayload = JSON.parse(atob(this.adminUser.split('.')[1])); 
          return tokenPayload.id || null; 
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
      return null;
    }
  
  
  fetchOrders() {
    const restaurantName = this.restaurantDetails.name;
    console.log('Fetching orders for restaurant:', restaurantName);
  
    this.orderService.getRestaurantOrders(restaurantName).subscribe(
      (response) => {
        console.log('Restaurant orders:', response);
        this.restaurantOrders = response;
      },
      (error) => {
        console.error('Error fetching restaurant orders', error);
      }
    );
  }  

  processOrder(orderId: string): void {
    this.orderService.updateAdminStatus(orderId).subscribe(
      () => {
        console.log(`Order with ID ${orderId} processed successfully`);
        this.snackBar.open('Order processed successfully', 'dismiss', { duration: 2000 });
        this.fetchOrders();
      },
      (error) => {
        console.error('Error processing order:', error);
        this.snackBar.open('Error processing order. Please try again.', 'dismiss', { duration: 2000 });
      }
    );
  }


  toggleFeedback(order: any): void {
    order.showFeedback = !order.showFeedback;
  }
    
    logout() {
      localStorage.removeItem('currentUser');
      console.log(localStorage.getItem('currentUser'));
      this.snackBar.open('Log-out Successfuly!', 'Close', {
        duration: 5000, 
      });
      this.router.navigateByUrl('/admin-login');
    }

}