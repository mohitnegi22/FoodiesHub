import { Component, Input } from '@angular/core';
import { LocationService } from '../services/location.service';
import { GeolocationService } from '../services/geolocation.service';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';
import { UserDetail } from '../models/userDetails';
import { UserDetailService } from '../services/user-detail.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() showSearch: boolean = true;
  userDetails: UserDetail = {};
  locationName: string | undefined;
  searchText: string = '';
  userName: String;
  cartCount: number = 0;
  private cartCountSubscription: Subscription;
  constructor(
    private geolocationService: GeolocationService,
    private locationService: LocationService,
    private userService:UserDetailService,
    private searchService: SearchService,
    private router: Router,
    public authService:AuthService,
    private cartService: CartService,
    private userAuthGuard: UserAuthGuard,
  
  ) {
    this.locationService.location$.subscribe((location) => {
      this.locationName = location;
    });
  }

  ngOnInit() {
    this.fetchUserDetails();
    // Subscribe to cartCount$ to get real-time updates
    this.cartCountSubscription = this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  // ngOnDestroy() {
  //   // Unsubscribe to prevent memory leaks
  //   this.cartCountSubscription.unsubscribe();
  // }
  onFindMeClick() {
    this.geolocationService.geoFindMe();
  }

  onSearchInputChange() {
    this.searchService.setSearchText(this.searchText);
  }

  onFavoriteClick() {
    this.router.navigate(['/favorite']);
}

getUserName(): string | null {
  this.userName = localStorage.getItem('currentUser');

  if (this.userName) {
    try {
      const tokenPayload = JSON.parse(atob(this.userName.split('.')[1])); 
     
      return tokenPayload.name || null; 
      
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  return null;
}

fetchUserDetails() {
  this.userService.getUserDetailsForImage().subscribe(
    (data) => {
      console.log('Data fetched', data);
      this.userDetails = data.user;
    },
    (error) => {
      console.log(error);
      // this.snackBar.open('Something went wrong', 'close', { duration: 3000 });
    }
  );
}

public baseUrl = 'http://localhost:8888/food-app'

getImageSrc(): string {
  if (this.userDetails && this.userDetails.profileImagePath) {
    let imagePath = this.userDetails.profileImagePath.replace(/^\//, '');
    imagePath = encodeURIComponent(imagePath);
    return `${this.baseUrl}/getImage/${imagePath}`;
  }
  else { 
    return "../../assets/pro.png";
  }
}
  
redirectToLandingPage() {
  this.router.navigate(['']); 
}

logout(){
  this.authService.logout();
}

isAdmin(): boolean {
  const userRole = this.userAuthGuard.checkRole();
  return userRole === 'admin';
}

goToOrders(): void {
  this.router.navigate(['/orders']);
}

}