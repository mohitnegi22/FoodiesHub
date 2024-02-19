import { Component, Input } from '@angular/core';
import { LocationService } from '../services/location.service';
import { GeolocationService } from '../services/geolocation.service';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart.service';
import { UserDetailService } from '../services/user-detail.service';
import { UserDetail } from '../models/userDetails';

@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.css']
})
export class Header2Component {
  @Input() showSearch: boolean = true;

  locationName: string | undefined;
  searchText: string = '';
  userName: String;
  cartItemCount: number = 0;
  userDetails: UserDetail = {};

  constructor(
    private geolocationService: GeolocationService,
    private locationService: LocationService,
    private searchService: SearchService,
    private router: Router,
    public authService:AuthService,
    private cartService: CartService,
    private userService:UserDetailService,
    private userAuthGuard: UserAuthGuard
  ) {
    this.locationService.location$.subscribe((location) => {
      this.locationName = location;
    });
  }

  ngOnInit(): void {
    this.fetchUserDetails();
    this.cartService.cartItemCount$.subscribe((count) => {
      this.cartItemCount = count;
    });
  }
  onFindMeClick() {
    this.geolocationService.geoFindMe();
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