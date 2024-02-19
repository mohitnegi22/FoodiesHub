import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserDetailService } from '../services/user-detail.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;

  showEmailForm: boolean = true;
  showOtpForm: boolean = false;
  showPasswordForm: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService:UserDetailService,
     private snackBar: MatSnackBar, private router:Router){}

     ngOnInit(): void {
      this.emailForm = this.formBuilder.group({
        emailId: ['', [Validators.required]]
      });
  
      this.otpForm = this.formBuilder.group({
        otp: ['', [Validators.required]]
      });
  
      this.passwordForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
      });
    }


  sendOtp() {
    if (this.emailForm.valid) {  
      this.showOtpForm = true;
      this.showEmailForm = false;

      const emailId = this.emailForm.get('emailId').value;
      this.userService.forgotPasswordOTP(emailId).subscribe(
        (response)=>{
          this.showEmailForm = false;
          this.showOtpForm = true;
          this.snackBar.open('OTP Sent, Please Check Your Email', 'Close', {duration: 2000,});
        },
        (error)=>{
          if (error.status === 404){
            this.showOtpForm = false;
            this.showEmailForm = true;
          this.snackBar.open('Please Check Your Email', 'Close', {duration: 2000,});
          }else{
          console.error('Error sending OTP:', error);
          this.snackBar.open('Something went wrong.', 'Close', { duration: 2000 });
          }
        }
      );
    }
  }
//=================================================================================
  onOtpSubmit() {
    if (this.otpForm.valid) {
     
      const emailId = this.emailForm.get('emailId').value;
      const otp = this.otpForm.get('otp').value;

     this.userService.verifyPasswordOTP(emailId, otp).subscribe(
      (response)=>{
        if (response && response['status'] === 'success') {
          this.showOtpForm = false;
          this.showPasswordForm = true;
          console.log("Otp Verified", response);
          this.snackBar.open(response['message'], 'Close', { duration: 2000 });
        } else {
          console.log("OTP Incorrect or other error", response);
          this.snackBar.open(response['message'], 'Close', { duration: 2000 });
        }
      },
      (error) => {
        console.error("Error verifying OTP", error);
        this.snackBar.open('Error verifying OTP', 'Close', { duration: 2000 });
      }
     );
    }
  }
  //================================================================================================
  onChangePassword() {
    if (this.emailForm.valid && this.passwordForm.valid) {
     
      const emailId = this.emailForm.get('emailId').value;
      const password = this.passwordForm.get('password').value;
      
      this.userService.changePassword(emailId,password).subscribe(
        (response)=>{
          if (response && response['status'] === 'success') {
            this.showOtpForm = false;
            this.showPasswordForm = false;
            console.log("Otp Verified", response);
            this.router.navigate(['/login']);
            this.snackBar.open(response['message'], 'Close', { duration: 3000 });
          } else {
            console.log("OTP Incorrect or other error", response);
            this.snackBar.open(response['message'], 'Close', { duration: 3000 });
          }
        },
        (error)=>{
        console.error("Error Changing Password", error);
        this.snackBar.open('Error Changing Password', 'Close', { duration: 3000 });
        }

      );
    }
  }
}
