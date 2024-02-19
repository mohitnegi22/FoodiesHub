import { Component} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailService } from '../services/user-detail.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  hidePassword: boolean = true;
  profileImageFile: File;
  imageUrl: string;

  constructor(private fb: FormBuilder, private authService:AuthService, private router:Router,
     private snackBar:MatSnackBar, private dialog:MatDialog , private userService:UserDetailService ){
  }

  ngOnInit() {
    this.watchEmailChanges();
  }

  private watchEmailChanges() {
    this.signupForm.get('emailId')?.valueChanges.subscribe((emailId) => {

      const emailControl = this.signupForm.get('emailId');

    emailControl?.setErrors(null);

    if (emailId.length < 1) {
      this.signupForm.get('emailId')?.setErrors({ required: true });
      return;
    }
      const emailPattern = /^[^0-9][a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailPattern.test(emailId)) {
      this.signupForm.get('emailId')?.setErrors({ invalidEmail: true });
      return;
    }
    this.checkEmailExistence(emailId);

    });
  }

  private checkEmailExistence(emailId: string) {
    this.authService.getAllUsers().subscribe(
      (response) => {
        console.log("all users = " + response);
        const emailExists = response.some((user:any) => user.emailId === emailId);
        if (emailExists) {
          this.signupForm.get('emailId')?.setErrors({ emailExists: true });
        } else {
          this.signupForm.get('emailId')?.setErrors(null);
        }
      },
      (error) => {
        console.error('Error checking email existence:', error);
      }
    );
  }
//========================================================================================================
    signupForm: FormGroup = this.fb.group({
    emailId: ['',[Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    confirmPassword: ['', [Validators.required, this.passwordMatchValidator]],
    name: ['',[Validators.required, Validators.minLength(4)]],
    city: ['', [Validators.required, Validators.maxLength(30)]], 
    state: ['', [Validators.required]], 
    fullAddress: ['', [Validators.required, Validators.maxLength(200)]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(\d{1})?$/)]],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^[789]\d{9}$/)]],
    otp: [''],
    profileImagePath: [''],
  }); 


togglePasswordVisibility() {
  this.hidePassword = !this.hidePassword;
}

get emailId() { 
  return this.signupForm.get('emailId'); 
}

get password() { 
  return this.signupForm.get('password'); 
}

get confirmPassword() { 
  return this.signupForm.get('confirmPassword'); 
}

get name() { 
  return this.signupForm.get('name'); 
}

get city() { 
  return this.signupForm.get('city'); 
}

get state() { 
  return this.signupForm.get('state'); 
}

get fullAddress() { 
  return this.signupForm.get('fullAddress'); 
}

get zipCode() { 
  return this.signupForm.get('zipCode'); 
}

get mobileNumber() { 
  return this.signupForm.get('mobileNumber'); 
}

get otp() { 
  return this.signupForm.get('otp'); 
}

get profileImagePath() { 
  return this.signupForm.get('profileImagePath'); 
}



onSubmit() {
  console.log('Starting onSubmit...');

  console.log('Form is not valid. Checking individual controls...');
  Object.keys(this.signupForm.controls).forEach(controlName => {
    const control = this.signupForm.get(controlName);
    console.log(`Control: ${controlName}, Valid: ${control.valid}, Errors: ${JSON.stringify(control.errors)}`);
  });

  if (this.signupForm.valid) {
    const emailId = this.signupForm.get('emailId').value;

   const img = this.signupForm.get('profileImagePath').value;
   console.log('Signup form image path', img);
    
    const formData = new FormData();
    formData.append('profileImage', this.profileImageFile);

    this.userService.uploadSignUpProfileImage(emailId, this.profileImageFile).subscribe(
      (uploadResponse: any) => {
        console.log('Profile image uploaded successfully', uploadResponse);
        this.signupForm.patchValue({ profileImagePath: uploadResponse.imageUrl });
         
        this.authService.generateAndSendOtp(emailId).subscribe(
          (otpResponse) => {
            console.log('OTP generated successfully', otpResponse);

            const dialogRef = this.dialog.open(OtpDialogComponent, {
              width: '400px',
              data: { email: emailId },
            });

            dialogRef.afterClosed().subscribe((otp: string) => {
              if (otp) {
                this.signupForm.patchValue({ otp: otp });

                this.authService.signup(this.signupForm.value).subscribe(
                  (signupResponse) => {
                    console.log('User registration successful:', signupResponse);
                    this.snackBar.open('User registration successful', 'Close', {
                      duration: 4000,
                    });
                    this.router.navigate(['/login']);
                  },
                  (signupError) => {
                    console.error('Error during user registration:', signupError);

                    if (signupError && signupError.error && signupError.error.message === 'Email already exists') {
                      this.emailId.setErrors({ emailExists: true });
                    }

                    this.snackBar.open('Error during user registration. Please try again later.', 'Close', {
                      duration: 4000,
                    });
                  }
                );
              } else {
                console.log('User closed the dialog without entering OTP');
                this.snackBar.open('No OTP Entered', 'Close', {
                  duration: 4000,
                });
              }
            });
          },
          (otpError) => {
            console.error('Error generating OTP:', otpError);
            this.snackBar.open('Error generating OTP. Please try again later.', 'Close', {
              duration: 4000,
            });
          }
        );
      },
      (uploadError: any) => {
        console.error('Error uploading profile image', uploadError);
        this.snackBar.open('Error uploading profile image. Please try again.', 'Close', {
          duration: 4000,
        });
      }
    );
  } else {
    console.log('Form is not valid.');
  }

  console.log('End of onSubmit.');
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
  const fileInput = document.getElementById('profileImage') as HTMLInputElement;
  fileInput.click();
}

//======================================================================================================

passwordMatchValidator (control: AbstractControl) { 
  const password = control.parent?.get('password')?.value; 
  const confirmPassword = control?.value;
  if (password !== confirmPassword) { 
    return { passwordMismatch: true };
  }
   return null;
}

}