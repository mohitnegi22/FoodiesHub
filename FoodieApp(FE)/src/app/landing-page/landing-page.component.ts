import { Component, OnInit } from '@angular/core';
import { GeolocationData } from '../models/geolocation-data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GeolocationService } from '../services/geolocation.service';
import { LocationService } from '../services/location.service';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { UserDetailService } from '../services/user-detail.service';
import { UserDetail } from '../models/userDetails';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  selectedLocation: number = 0;
  locations: GeolocationData[] = [];
  userName: String;
  city: string = ''; // Add this variable for manual city entry
  state: string = ''; // Add this variable for manual state entry
  userDetails: UserDetail = {};

  taglines: string[] = ['Are you hungry?', 'Game night?', 'Late night at office?', 'Come hungry, leave happy.', 'Treat yourself!', 'Do not wait.', 
'Unexpected guests?', 'Cooking gone wrong?', 'Eat healthy.'];
  currentTaglineIndex: number = 0;

  constructor(private snackBar:MatSnackBar, private router:Router,private locationService: LocationService ,
     public authService:AuthService, private geolocationService: GeolocationService, private userAuthGuard: UserAuthGuard,private userService: UserDetailService) {}

  ngOnInit(): void {
    setInterval(() => this.nextTagline(), 2000);
    this.fetchLocations('');
    this.fetchUserDetails();
  }

  nextTagline() {
    this.currentTaglineIndex = (this.currentTaglineIndex + 1) % this.taglines.length;
  }

  isSuperAdmin(): boolean {
    const userRole = this.userAuthGuard.checkRole();
    return userRole === 'Admin';
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
  fetchLocations(query: string): void {
    this.geolocationService.geoFindMe();

    this.geolocationService.geolocation$.subscribe((data: GeolocationData) => {
      if (data.error) {
        console.error('Error getting geolocation:', data.error);
      } else {
        this.locations = [data];
      }
    });
  }

  findFood(): void {
    // Check if the user has selected a location
    if (this.selectedLocation) {
      // Redirect to the Home component with the selected location
      this.router.navigate(['/home'], { queryParams: { location: this.selectedLocation } });
      this.locationService.setLocation(this.selectedLocation.toString()); // Set the location
    } else {
      // If no location is selected, open the location dialog
      // this.openLocationDialog();
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    
    console.log(localStorage.getItem('currentUser'));
    
    this.snackBar.open('Log-out Success!', 'Close', {
      duration: 5000, 
    });
    this.router.navigateByUrl('/login');

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


  isAdmin(): boolean {
    const userRole = this.userAuthGuard.checkRole();
    return userRole === 'admin';
  }

 

}
