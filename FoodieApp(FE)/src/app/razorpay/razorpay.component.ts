import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderServiceService } from '../services/order-service.service';
import { HttpClient } from '@angular/common/http';

declare var Razorpay: any;

@Component({
  selector: 'app-razorpay',
  templateUrl: './razorpay.component.html',
  styleUrls: ['./razorpay.component.css']
})
export class RazorpayComponent implements OnInit {

  title = 'demo';

  form: any = {};

  constructor(private http: HttpClient, private orderService: OrderServiceService) {}

  ngOnInit() {}



  paymentId: string;
  error: string;

  options = {
    key: "rzp_test_4ddJIE4qOr1O6c",
    amount: "",
    name: "Foodies Hub",
    description: "Web Development",
    image: "https://i.ibb.co/M52L4D0/landing.png",
    order_id: "",
    handler: (response: any) => {
      this.onPaymentSuccess(response);
    },
    prefill: {
      name: "Foodies Hub",
      email: "m31negisomeone@gmail.com",
      contact: "999999999"
    },
    notes: {
      address: ""
    },
    theme: {
      color: "#3399cc"
    }
  };

  onSubmit(): void {
    this.paymentId = '';
    this.error = '';
    if (typeof Razorpay === 'undefined') {
      console.error('Razorpay library not loaded.');
      return;
    }
  
    this.orderService.createOrder(this.form).subscribe(
      data => {
        this.options.key = data.secretId;
        this.options.order_id = data.razorpayOrderId;
        this.options.amount = data.applicationFee;
        this.options.prefill.name = "Foodies Hub";
        this.options.prefill.email = "m31negisomeone@gmail.com";
        this.options.prefill.contact = "999999999";
  
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
  

  onPaymentSuccess(response: any): void {
    console.log(response);
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
}
