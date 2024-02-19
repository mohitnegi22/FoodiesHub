import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credential = { emailId: '', password: ''};

  constructor(private authService: AuthService, private snackBar:MatSnackBar, private router: Router){}

  login(loginForm: any){
    console.log(this.credential);
    this.authService.login(this.credential.emailId, this.credential.password).subscribe(
      (response)=>{
  
        let resp:any = response;
        if(resp && resp.key){
          
          localStorage.setItem('currentUser', resp.key);
          console.log('Logged-in user name:', resp.emailId);

          console.log(resp.key);
          this.snackBar.open('loggedIn Successfuly!', 'Close', {
            duration: 5000, 
          });
          this.router.navigateByUrl('');
  
        }else{
          this.snackBar.open('Please Check Your Credentials!', 'Close', {
            duration: 5000, 
          });
        }
      },
      (error: any)=>{
        console.error(error);
        alert('login Failed, please try again');
      }
    );
  }

  navigate(){
    this.router.navigate(['/forgot-password']);
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']); 
  }

}