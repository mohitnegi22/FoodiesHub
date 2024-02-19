import { Component } from '@angular/core';
import{CartItem} from '../models/cartItem';
import { ActivatedRoute } from '@angular/router';
import { DeliveryService } from '../services/delivery.service';
import { CartService } from '../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { SharedDataService } from '../services/shared-data.service';
import { Subject } from 'rxjs';
import { Menu } from '../models/restaurant';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css']
})
export class RestaurantDetailsComponent {
  restaurant: any;
  cartDetails: any;
  isLoggedIn: boolean = false;
  originalMenu: Menu[];
  

  selectedQuantities: Map<number, number> = new Map<number, number>();

  private restaurantSubject = new Subject<any>();
  restaurant$ = this.restaurantSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private deliveryService: DeliveryService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {

    const restaurantId = this.route.snapshot.paramMap.get('id');

    if (restaurantId !== null) {
      this.deliveryService.getRestaurantDetails(restaurantId).subscribe(
        (restaurant) => {

          this.restaurant = restaurant;
          this.originalMenu = [...restaurant.menu];
          this.sharedDataService.setRestaurantData({
            name: restaurant.name,
            city: restaurant.city,
            images: restaurant.images,
          });

          console.log('Restaurant details fetched successfully:', restaurant);

          // Emit the restaurant details using the Subject
          this.restaurantSubject.next(restaurant);

          this.isLoggedIn = this.authService.isAuthenticated();
          console.log('Is logged in:', this.isLoggedIn);
        },
        (error) => {
          console.error('Error fetching restaurant details:', error);
        }
      );
    } else {
      console.error('Restaurant ID is null');
    }
    
  }


  decreaseQuantity(index: number): void {
    const currentQuantity = this.selectedQuantities.get(index) || 0;
    if (currentQuantity > 0) {
      this.selectedQuantities.set(index, currentQuantity - 1);
    }
  }
  
  increaseQuantity(index: number): void {
    this.selectedQuantities.set(index, (this.selectedQuantities.get(index) || 0) + 1);
  }
  

  addToCart(item: any, index: number) {
    const selectedQuantity = this.selectedQuantities.get(index) || 0;
  
    if (selectedQuantity > 0) {
      item.quantity = selectedQuantity;
  
      item.restaurantId = this.restaurant.id;
      item.restaurantName = this.restaurant.name;
  
      this.cartService.addProductToCart(item).subscribe(
        (response: any) => {
          console.log('Product added to cart.', response.cart);
          this.cartDetails = response.cart; 
          const totalCount = this.cartDetails.reduce((count: any, cartItem: { quantity: any; }) => count + cartItem.quantity, 0);
          this.cartService.updateCartCount(totalCount);
          this.snackBar.open("Item added successfully", 'continue', {
            duration: 2000,
          });
  
  
          this.selectedQuantities.set(index, 0);
        },
        (error) => {
          console.error('Error adding product to cart:', error);
          this.snackBar.open("Something went wrong", 'continue', {
            duration: 2000,
          });
  
          if (error.status === 401) {
            console.error('User is not authenticated. Redirect to login or handle accordingly.');
          } else {
            console.error('Unexpected error. Please check the server logs for more details.');
          }
        }
      );
    } else {
      console.log("Quantity not selected. Item not added.");
      this.snackBar.open("Quantity not selected. Item not added.", 'continue', {
        duration: 2000,
      });
    }
  }
  
  
  getRatingColor(rating: number): string {
    if (rating >= 0 && rating <= 2.9) {
      return 'red';
    } else if (rating >=3.0 && rating <= 3.9) {
      return 'yellow';
    } else {
      return '#02de23';
    }
  }



  typeFilterOptions = [
    { label: 'Pure-Veg', value: 'pureVeg' },
    { label: 'Non-Veg', value: 'nonVeg' },
  ];
  selectedTypeFilter: string | null = null;
  

  sortOptions = [
    { label: 'Cost Low to High', value: 'costLowToHigh' },
    { label: 'Cost High to Low', value: 'costHighToLow' },
    { label: 'Rating Low to High', value: 'ratingLowToHigh' },
    { label: 'Rating High to Low', value: 'ratingHighToLow' },
  ];
  selectedSortOption: string | null = null;

ratingFilterOptions = [
  { label: '3.0+', value: 3.0 },
  { label: '4.0+', value: 4.0 },
];
selectedRating: number | null = null;

priceFilterOptions = [
  { label: 'Less than Rs. 100', value: 'lt100' },
  { label: 'Rs. 100 to Rs. 200', value: '100to200' },
  { label: 'Rs. 200 to Rs. 300', value: '200to300' },
  { label: 'Rs. 300 to Rs. 600', value: '300to600' },
];
selectedPriceFilter: string | null = null;

applyFilters(): void {
  this.restaurant.menu = [...this.originalMenu];

  this.restaurant.menu = this.restaurant.menu.filter((item: any) => {
    return (
      (!this.selectedRating || item.rating >= this.selectedRating) &&
      (!this.selectedPriceFilter || this.applyPriceFilter(item)) &&
      (!this.selectedTypeFilter || this.applyTypeFilter(item))
    );
  });

  if (this.selectedSortOption) {
    this.restaurant.menu = this.sortMenu(this.selectedSortOption);
  }
}

applyPriceFilter(item: any): boolean {
  switch (this.selectedPriceFilter) {
    case 'lt100':
      return item.price < 100;
    case '100to200':
      return item.price >= 100 && item.price <= 200;
    case '200to300':
      return item.price > 200 && item.price <= 300;
    case '300to600':
      return item.price > 300 && item.price <= 600;
    default:
      return true; 
  }
}

sortMenu(option: string): Menu[] {
  switch (option) {
    case 'costLowToHigh':
      return this.restaurant?.menu.slice().sort((a: Menu, b: Menu) => a.price - b.price) || [];
    case 'costHighToLow':
      return this.restaurant?.menu.slice().sort((a: Menu, b: Menu) => b.price - a.price) || [];
    case 'ratingLowToHigh':
      return this.restaurant?.menu.slice().sort((a: Menu, b: Menu) => a.rating - b.rating) || [];
    case 'ratingHighToLow':
      return this.restaurant?.menu.slice().sort((a: Menu, b: Menu) => b.rating - a.rating) || [];
    default:
      return this.restaurant?.menu || [];
  }
}

applyTypeFilter(item: any): boolean {
  switch (this.selectedTypeFilter) {
    case 'pureVeg':
      return item.type === 'veg';
    case 'nonVeg':
      return item.type === 'non veg';
    default:
      return true;
  }
}


resetFilters(): void {
  this.selectedRating = null;
  this.selectedPriceFilter = null;
  this.selectedSortOption = null;
  this.selectedTypeFilter = null;

  this.restaurant.menu = [...this.originalMenu];
 }
  

  decreaseQuantityAndPrice(item: any) {
    this.cartService.decreaseQuantityAndPrice(item).subscribe(
      (response: any) => {
        console.log('Quantity and price decreased.', response);
        this.cartDetails = response;
        this.snackBar.open("Quantity and price decreased successfully", 'continue', {
          duration: 2000,
        });
      },
      (error) => {
        console.error('Error decreasing quantity and price:', error);
        console.error('Error details:', error.error); 
        this.snackBar.open("Something went wrong. Check console for details.", 'continue', {
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


}
