import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { UserDetailService } from '../services/user-detail.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  userEmail: string;
  orderHistory: any[] = [];

  constructor(private orderService: OrderService, private userDetailService: UserDetailService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchUserEmailAndOrderHistory();
  }

  fetchUserEmailAndOrderHistory() {
    this.userDetailService.getUserDetails().subscribe(
      (userData) => {
        this.userEmail = userData.emailId;
        this.fetchOrderHistory();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  
  fetchOrderHistory() {
    this.orderService.getUserOrders(this.userEmail).subscribe(
      (data) => {
        console.log('Order History fetched', data);
        this.orderHistory = data;
  
        this.snackBar.open('Order history fetched successfully!', 'Close', {
          duration: 3000,
        });
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Error fetching order history. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

}