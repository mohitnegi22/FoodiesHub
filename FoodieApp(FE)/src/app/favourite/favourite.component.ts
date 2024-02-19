import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from '../models/restaurant';
import { RestaurantService } from '../services/restaurant.service';
import { UserDetailService } from '../services/user-detail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent {
  user: any = {};
  favoriteRestaurants: Restaurant[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private snackBar: MatSnackBar,
    private userService: UserDetailService,
    private router:Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dialog: MatDialog 
  ) { }

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe((userData) => {
      this.user = userData;
      this.fetchFavoriteRestaurants();
    });
  }

  navigateToRestaurantDetails(restaurantId: string) {
    this.router.navigate(['/restaurant', restaurantId]);
  }

  fetchFavoriteRestaurants() {
    this.userService.getUserDetails().subscribe((userData) => {
      this.user = userData;
  
      // Ensure that favorites property exists in the user object
      if (this.user && this.user.favourites) {
        this.favoriteRestaurants = [...this.user.favourites]; // Use spread operator to create a new array
      } else {
        this.favoriteRestaurants = []; // Set to an empty array if no favorites
      }
    });
  }
  
  

  removeFromFavorites(event: Event, restaurantId: string) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to remove this restaurant from favorites?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmRemoveFromFavorites(restaurantId);
      }
    });
  }

  private confirmRemoveFromFavorites(restaurantId: string) {
    this.restaurantService.removeFromFavorites(restaurantId).subscribe(
      (response) => {
        console.log('Removed from favorites response:', response);
        this.showSnackbar('Removed from favorites');

        // Manually reset favoriteRestaurants array
        this.favoriteRestaurants = this.favoriteRestaurants.filter(restaurant => restaurant._id !== restaurantId);

        console.log('Updated favoriteRestaurants:', this.favoriteRestaurants);
      },
      (error) => {
        console.error('Error removing from favorites:', error);
        this.showSnackbar('Failed to remove from favorites');
      }
    );
  }
  
  

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
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
}