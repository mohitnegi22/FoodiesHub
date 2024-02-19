import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(private fb: FormBuilder, private authService:AuthService,private snackBar:MatSnackBar,private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      id: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const id =  this.loginForm.get('id').value;
      const password = this.loginForm.get('password').value;
       
      this.authService.adminLogin(id,password).subscribe(
        (response: any) => {
          let resp: any = response;
          if (resp && resp.key) {
            localStorage.removeItem('currentUser');
            localStorage.setItem('currentUser', resp.key);

            console.log('Logged-in user name:', resp.emailId);
            console.log(resp.key);
            this.router.navigate(['/']);
            this.snackBar.open('LoggedIn Successfully!', 'Close', {
              duration: 5000,
            });
    
          }else {
            this.snackBar.open('Please Check Your Credentials!', 'Close', {
              duration: 5000,
            });
          }
        },
        (error: any)=>{
          console.log(error);
          this.snackBar.open('Something Went wrong, Please Check your Credentials!', 'Close', {
            duration: 5000,
          });
        }
      )
    }
  }

  navigateToHomepage() {
    this.router.navigate(['/home']); 
  }
}