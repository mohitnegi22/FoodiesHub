import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryService } from '../services/delivery.service';
import { LocationService } from '../services/location.service';
import { RestaurantService } from '../services/restaurant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailService } from '../services/user-detail.service';
import { Restaurant } from '../models/restaurant';
import { ChangeDetectorRef } from '@angular/core';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent {
  user: any = {};

  locationName: string | undefined;
  restaurants: any[] = [];
  states: string[] = []; 
  cities: string[] = []; 
  selectedState: string = ''; 
  selectedCity: string = ''; 
  filteredRestaurants: any[] = []; 
  searchText: string = '';
  allCuisines: string[] = [];
  selectedCuisine: string = '';
  selectedSort: string = 'rating';
sortOrder: string = 'desc'; 

  constructor(
    private locationService: LocationService,
    private deliveryService: DeliveryService,
    private router: Router,
    private restaurantService: RestaurantService ,
    private snackBar: MatSnackBar,
    private userService: UserDetailService,
    private changeDetectorRef: ChangeDetectorRef,
    private searchService: SearchService,
    private ngZone: NgZone,
  ) {
    
    this.locationService.location$.subscribe((location) => {
      this.locationName = location;
    });
  }

  ngOnInit(): void {
    this.selectedState = ''; 
    this.selectedCity = ''; // Set default city here
    this.filterCities();
    this.userService.getUserDetails().subscribe((userData) => {
      this.user = userData;
    });
  
    this.deliveryService.getRestaurants().subscribe((restaurants) => {
      this.restaurants = restaurants;
      this.filteredRestaurants = restaurants; 
      this.updateCuisines();
    });
    this.searchService.searchText$.subscribe((searchText) => {
      this.searchText = searchText;
      this.applySearch();
    });

    this.deliveryService.getStatesAndCities().subscribe((data) => {
      this.states = data;
      console.log('Distinct States:', this.states);    
    
      this.selectedState = '';
      this.selectedCity=''
      // Initialize selectedState here
      console.log('States:', this.states);
      console.log('Selected State:', this.selectedState);
      console.log('city', this.selectedCity)
      this.filterCities();
    });
  
    
  }

  sortRestaurants() {
    switch (this.selectedSort) {
      case 'rating':
        this.filteredRestaurants.sort((a, b) => {
          if (this.sortOrder === 'asc') {
            return a.rating - b.rating;
          } else {
            return b.rating - a.rating;
          }
        });
        break;
    
      default:
  
        this.filteredRestaurants.sort((a, b) => {
          if (this.sortOrder === 'asc') {
            return a.rating - b.rating;
          } else {
            return b.rating - a.rating;
          }
        });
        break;
    }
  }
  filterRestaurants() {
    if (this.selectedState) {
      if (this.selectedCity && this.selectedCity !== 'All Cities') {
        // City is selected, fetch restaurants for the selected city
        this.deliveryService.getRestaurantsByStateAndCity(this.selectedState, this.selectedCity).subscribe((restaurants) => {
          console.log("Restaurants for State and City:", this.selectedState, this.selectedCity, restaurants);
          this.filteredRestaurants = restaurants;
          this.updateCuisines();
          this.applyCuisineFilter();
          this.sortRestaurants();
        });
      } else {
        // No specific city selected or "All Cities" selected, fetch restaurants based on the selected state
        this.deliveryService.getRestaurantsByState(this.selectedState).subscribe((restaurants) => {
          console.log("Restaurants for State:", this.selectedState, restaurants);
          this.filteredRestaurants = restaurants;
          this.applyCuisineFilter();
          this.sortRestaurants();
        });
      }
      // Fetch cities based on the selected state
      this.deliveryService.getCitiesByState(this.selectedState).subscribe((cities) => {
        console.log("Cities for State:", this.selectedState, cities);
        this.cities = ['All Cities'].concat(cities); // Add "All Cities" as the first option
        this.changeDetectorRef.detectChanges();
      });
    } else {
      this.cities = ['Select City']; // Add "Select City" as the only option
      this.changeDetectorRef.detectChanges();
    }
  }
  
  
  
  updateCuisines() {
    // Extract all distinct cuisines from the filtered restaurants data
    this.allCuisines = this.filteredRestaurants.reduce((cuisines, restaurant) => {
      restaurant.cuisine.forEach((cuisine: any) => {
        if (!cuisines.includes(cuisine)) {
          cuisines.push(cuisine);
        }
      });
      return cuisines;
    }, []);
  }
  
  



  navigateToRestaurantDetails(restaurantId: string) {
    this.router.navigate(['/restaurant', restaurantId]);
  }


  images: any = ['assets/delivery/Burger.avif',
'../../assets/delivery/Chinese.avif',
'../../assets/delivery/Chole_Bature.avif',
'../../assets/delivery/Kebabs.avif',
'../../assets/delivery/Momos.avif',
'../../assets/delivery/Noodles.avif',
'../../assets/delivery/Paratha.avif',
'../../assets/delivery/North_Indian_4.avif',
'../../assets/delivery/Pasta.avif',
'../../assets/delivery/Pav_Bhaji.avif',
'../../assets/delivery/Pizza.avif',
'../../assets/delivery/Rolls.avif',
'../../assets/delivery/Sandwich.avif'
];

brandimages:String[]=['../../assets/delivery/1.avif',
'assets/delivery/2.avif',
'assets/delivery/4.avif',
'assets/delivery/5.avif',
'assets/delivery/8.avif',
'assets/delivery/9.avif',
]
onStateChange() {
  this.filterCities();
  this.updateCuisines();
  this.filterRestaurants(); // Call filterRestaurants whenever the state changes
}
filterCities() {
  if (this.selectedState) {
    if (this.selectedCity) {
      // City is selected, fetch restaurants for the selected city
      this.deliveryService.getRestaurantsByStateAndCity(this.selectedState, this.selectedCity).subscribe((restaurants) => {
        console.log("Restaurants for State and City:", this.selectedState, this.selectedCity, restaurants);
        this.filteredRestaurants = restaurants;
        this.updateCuisines();
        this.sortRestaurants();
      });
    } else {
      // No specific city selected, filter restaurants based on the selected state
      this.filteredRestaurants = this.restaurants.filter(restaurant =>
        restaurant.state === this.selectedState
      );
      this.updateCuisines();
      this.sortRestaurants();
    }
    // Fetch cities based on the selected state
    this.deliveryService.getCitiesByState(this.selectedState).subscribe((cities) => {
      console.log("Cities for State:", this.selectedState, cities);
      this.cities = ['All Cities'].concat(cities); // Add "All Cities" as the first option
      this.changeDetectorRef.detectChanges();
    });
  } else {
    this.cities = ['Select City']; // Add "Select City" as the only option
    this.changeDetectorRef.detectChanges();
  }
}






filterRestaurantsByCuisine() {
  this.filterRestaurants(); // Reapply other filters
}

fetchRestaurants() {
  this.filterRestaurants();
}

addToFavorites(event: Event, restaurantId: string) {
  event.stopPropagation();

  if (this.isRestaurantInFavorites(restaurantId)) {
    this.showSnackbar('Restaurant is already in favorites');
    return;
  }

  this.restaurantService.addToFavorites(restaurantId).subscribe(
    (response: any) => {
      console.log('Added to favorites:', response);

      // Update the user's favorites based on the response
      this.user.favourites = response.favourites;

      this.showSnackbar('Added to favorites');
    },
    (error: any) => {
      console.error('Error adding to favorites:', error);
      this.showSnackbar('Failed to add to favorites');
    }
  );
}

isRestaurantInFavorites(restaurantId: string): boolean {
  return this.user.favourites.some((restaurant: Restaurant) => restaurant._id === restaurantId);
}



private showSnackbar(message: string) {
  this.snackBar.open(message, 'Close', {
    duration: 3000, 
    verticalPosition: 'top', 
    horizontalPosition: 'center',
  });
}


applySearch() {
  this.filteredRestaurants = this.restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(this.searchText.toLowerCase())
  );
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
applyCuisineFilter() {
  if (this.selectedCuisine) {
    this.filteredRestaurants = this.filteredRestaurants.filter(restaurant =>
      restaurant.cuisine.includes(this.selectedCuisine)
    );
  }}
}