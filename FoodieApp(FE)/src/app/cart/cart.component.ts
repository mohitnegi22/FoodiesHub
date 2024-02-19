import { Component,HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailService } from '../services/user-detail.service';
import { CartService } from '../services/cart.service';
import { SharedDataService } from '../services/shared-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../services/order.service';
import { OrderServiceService } from '../services/order-service.service';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// import * as Razorpay from 'razorpay';
// import * as Razorpay from 'razorpay';
declare var Razorpay: any;


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartDetails: any;
  restaurantData: any;
  totalItems: number = 0;
  paymentId: string;
  error: string;

  constructor(
    private cartService: CartService,
    private userDetail: UserDetailService,
    private snackBar: MatSnackBar,
    public sharedDataService: SharedDataService,
    private orderService: OrderService,
    private orderservice: OrderServiceService,
    private dialog:MatDialog,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.fetchUserDetails();
    this.getRestaurantData();
  }

  canDeactivate(): boolean {
    if (this.cartDetails && this.cartDetails.cart && this.cartDetails.cart.length > 0) {
      
      const leaveWithoutPayment = window.confirm('Are you sure you want to leave without making a payment?');
      
      if (leaveWithoutPayment) {
        
        this.clearCart();
      }
  
      return leaveWithoutPayment;
    }
    
    return true;
  }
  
  clearCart() {
    this.cartService.clearCart().subscribe(
      (response: any) => {
        console.log('Cart cleared successfully', response);
        this.cartDetails = response;
        
      },
      (error) => {
        console.error('Error clearing cart:', error);
        
      }
    );
  }
  
  getRestaurantData() {
    this.sharedDataService.restaurantData$.subscribe((data) => {
      console.log('Restaurant Data in CartComponent:', data);
      this.restaurantData = data;
      localStorage.setItem('restaurantData', JSON.stringify(data));
      this.refreshCart();
    });
  }

  fetchUserDetails() {
    this.userDetail.getUserDetails().subscribe(
      (response: any) => {
        this.cartDetails = response;
        this.refreshCart();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  addToCart(item: any) {
    if (!this.restaurantData) {
      this.snackBar.open('Please select a restaurant first.', 'dismiss', { duration: 2000 });
      return;
    }


    item.restaurantId = this.restaurantData.id;
    item.restaurantName = this.restaurantData.name;

    this.cartService.addProductToCartt(item).subscribe(
      (response: any) => {
        console.log('Product added to cart.', response);
        this.cartDetails = response;
        this.snackBar.open('Item added successfully', 'continue', {
          duration: 2000,
        });
        this.refreshCart();
      },
      (error) => {
        console.error('Error adding product to cart:', error);
        this.snackBar.open('Something went wrong', 'continue', {
          duration: 2000,
        });

        if (error.status === 401) {
          console.error('User is not authenticated. Redirect to login or handle accordingly.');
        } else {
          console.error('Unexpected error. Please check the server logs for more details.');
        }
      }
    );
  }

  decreaseQuantityAndPrice(item: any) {
    this.cartService.decreaseQuantityAndPrice(item).subscribe(
      (response: any) => {
        console.log('Quantity and price decreased.', response);
        this.cartDetails = response;
        this.snackBar.open('Quantity and price decreased successfully', 'continue', {
          duration: 2000,
        });
        this.refreshCart();
      },
      (error) => {
        console.error('Error decreasing quantity and price:', error);
        console.error('Error details:', error.error);
        this.snackBar.open('Something went wrong. Check console for details.', 'continue', {
          duration: 2000,
        });

        if (error.status === 401) {
          console.error('User is not authenticated. Redirect to login or handle accordingly.');
        } else {
          console.error('Unexpected error. Please check the server logs for more details.');
        }
      }
    );
  }

  removeProductFromCart(item: any) {
    this.cartService.removeProductFromCart(item).subscribe(
      () => {
        this.fetchUserDetails();
        this.snackBar.open('Item Removed', 'continue', {
          duration: 2000,
        });
      },
      (error) => {
        console.error('Error removing product:', error);
        this.snackBar.open('Something went wrong', 'continue', {
          duration: 2000,
        });
      }
    );
  }

  options = {
    key: "rzp_test_4ddJIE4qOr1O6c",
    amount: "",
    name: "Foodies Hub",
    description: "Web Development",
    image: "https://i.ibb.co/M52L4D0/landing.png",
    order_id: "",
    handler: (response: any) => {
      this.onPaymentSuccess(response);
      this.clearCart();
      this.refreshCart();
      const snackBarRef = this.snackBar.open('Payment Done!! Order Placed.', 'dismiss', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: 'custom-snackbar' 
      });
  
      // Set the snackbar container's style to top center
      snackBarRef.containerInstance.snackBarConfig.verticalPosition = 'top';
      snackBarRef.containerInstance.snackBarConfig.horizontalPosition = 'center';
      
    },
    prefill: {
      name: "Foodies Hub",
      email: "m31negisomeone@gmail.com",
      contact: "8076117877"
    },
    notes: {
      address: ""
    },
    theme: {
      color: "#3399cc"
    }
  };

  onPaymentSuccess(response: any): void {
    console.log(response);

    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
      // console.log("before clearing order id" ,localStorage.getItem('currentOrderId'));
      // localStorage.removeItem('currentOrderId');
      // console.log("after clearing order id" ,localStorage.getItem('currentOrderId'));
      this.router.navigate(['/home']);
    });
  }

  onPaymentFailed(response: any): void {
    console.log(response);
    console.log(response.error.code);
    console.log(response.error.description);
    console.log(response.error.source);
    console.log(response.error.step);
    console.log(response.error.reason);
    console.log(response.error.metadata.order_id);
    console.log(response.error.metadata.payment_id);
    this.error = response.error.reason;
  }

  @HostListener('window:payment.success', ['$event'])
  onWindowPaymentSuccess(event: { detail: any }): void {
    this.onPaymentSuccess(event.detail);
  }
  
  makePayment() {
    this.paymentId = '';
    this.error = '';
    if (!this.cartDetails || !this.cartDetails.cart || this.cartDetails.cart.length === 0) {
      this.snackBar.open('No items in the cart. Add items before making a payment.', 'dismiss', { duration: 2000 });
      return;
    }

    const order = {
      emailId: this.cartDetails.emailId,
      restaurantName: this.restaurantData.name,
      items: this.cartDetails.cart,
      totalAmount: this.cartDetails.totalCartPrice,
      fullAddress: this.cartDetails.fullAddress,
      city: this.cartDetails.city,
      state: this.cartDetails.state,
      zipCode: this.cartDetails.zipCode
    };

    this.orderService.createOrder(order).subscribe(
      (response) => {
        console.log('Order placed successfully', response);
        const orderid = response.id;
        console.log('Order id:', orderid);
        localStorage.setItem("currentOrderId" , orderid);
      },
      (error) => {
        console.error('Error placing order', error);
        if (error instanceof HttpErrorResponse) {
          console.error('Status:', error.status);
          console.error('Error body:', error.error);
        }
        this.snackBar.open('Error placing order. Please try again.', 'dismiss', { duration: 2000 });
      }
    );
    this.orderservice.createOrder(order).subscribe(
      data => {
        this.options.key = data.secretId;
        this.options.order_id = data.razorpayOrderId;
        this.options.amount = data.applicationFee;
        this.options.prefill.name = "Foodies Hub";
        this.options.prefill.email = "m31negisomeone@gmail.com";
        this.options.prefill.contact = "807611787";
  
        const razorpayInstance = new Razorpay(this.options);
  
        if (typeof razorpayInstance.open !== 'function') {
          console.error('Razorpay instance does not have the "open" method.');
          return;
        }
  
        razorpayInstance.open();
  
        razorpayInstance.on('payment.failed', (response: any) => {
          console.log(response);
          console.log(response.error.code);
          console.log(response.error.description);
          console.log(response.error.source);
          console.log(response.error.step);
          console.log(response.error.reason);
          console.log(response.error.metadata.order_id);
          console.log(response.error.metadata.payment_id);
          this.error = response.error.reason;
        });
      },
      err => {
        this.error = err.error.message;
      }

      
    );
    
  }
  

  private refreshCart() {
    this.totalItems = this.cartDetails?.cart.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
    this.cartService.updateCartItemCount(this.totalItems);
  }

}
