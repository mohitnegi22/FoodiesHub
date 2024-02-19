import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailService } from '../services/user-detail.service';
import { UserDetail } from '../models/userDetails';
import { Restaurant } from '../models/restaurant';
import { OrderService } from '../services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  editMode = false;
  user: any = {};
  favoriteRestaurants: Restaurant[] = [];
  userDetails: UserDetail = {};
  profileImageFile: File;
  imageUrl: string;
  orderHistory: any[] = [];
  userForm: FormGroup;


  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  constructor(private router: Router, private userService: UserDetailService, private snackBar: MatSnackBar, private orderService: OrderService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchUserDetails();   
    this.userService.getUserDetails().subscribe((userData) => {
      this.user = userData;
      this.fetchFavoriteRestaurants();
    });
  }

  initForm() {
    this.userForm = this.fb.group({
      emailId: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(4)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[789]\d{9}$/)]],
      fullAddress: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(30)]], 
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(\d{1})?$/)]],
    });
  }

  fetchUserDetails() {
    this.userService.getUserDetailsForImage().subscribe(
      (data) => {
        console.log('Data fetched', data);
        this.userDetails = data.user;

        this.userForm.patchValue({
          emailId: this.userDetails.emailId,
          name: this.userDetails.name,
          mobileNumber: this.userDetails.mobileNumber,
          fullAddress: this.userDetails.fullAddress,
          city: this.userDetails.city,
          state: this.userDetails.state,
          zipCode: this.userDetails.zipCode,
        });

        this.imageUrl = this.getImageSrc();
        this.snackBar.open('User Details Fetched', 'close', { duration: 3000 });
      },
      (error) => {
        console.log(error);
        if(error.status == 404){
          this.snackBar.open('Admin not allowed', 'close', { duration: 3000 });
          this.router.navigate(['/admin-login']);
        }else{
        this.snackBar.open('Something went wrong', 'close', { duration: 3000 });
        }
      }
    );
  }

  fetchFavoriteRestaurants() {
    this.favoriteRestaurants = this.user.favourites || [];
  }

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.profileImageFile = fileList[0];
    } else {
      this.profileImageFile = null;
    }
  }

  openFilePicker() {
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    fileInput.click();
  }

  uploadProfileImage() {
    if (this.profileImageFile != null && this.profileImageFile) {
      this.userService.uploadProfileImage(this.userDetails.emailId, this.profileImageFile).subscribe(
        (response: any) => {
          console.log('Profile image uploaded successfully', response);
          this.editMode = true;
          this.snackBar.open(response.message, 'close', {
            duration: 3000,
          });
          // this.fetchUserDetails();
        },
        (error: any) => {
          console.error('Error uploading profile image', error);
          this.snackBar.open('Error uploading profile image. Please try again.', 'close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('No profile image selected', 'close', { duration: 3000 });
    }
  }

  saveChanges() {
    if (this.userForm.valid) {
      this.userService.updateUserDetails(this.userForm.value).subscribe(
        (response: any) => {
          console.log('User details updated successfully', response);
          this.snackBar.open(response.message, 'close', {
            duration: 3000,
          });
          // this.uploadProfileImage();
          this.fetchUserDetails();
          this.editMode = false;
        },
        (error: any) => {
          console.error('Error updating user details', error);
          this.snackBar.open('Error updating user details. Please try again.', 'close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please correct the form errors before saving.', 'close', {
        duration: 3000,
      });
    }
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


  fetchOrderHistory() {
    const emailId = this.userDetails.emailId;
    console.log("emailid:", emailId);
    
    this.orderService.getUserOrders(emailId).subscribe(
      (data) => {
        console.log('Order History fetched', data);
        this.orderHistory = data;
        this.snackBar.open('Order History Fetched', 'close', { duration: 3000 });
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Error fetching order history', 'close', { duration: 3000 });
      }
    );
  }
  
}