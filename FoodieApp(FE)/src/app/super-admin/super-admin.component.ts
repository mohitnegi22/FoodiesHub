import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent {
  accounts: MatTableDataSource<any>;
  displayedColumns: string[] = ['emailId', 'name', 'city', 'state', 'zipCode', 'fullAddress', 'mobileNumber','actions'];
  

  loggedUser:String;

  constructor(private adminService:AdminService, private snackBar:MatSnackBar,private router:Router){};

  ngOnInit(): void {    
    const role: string | null = this.checkRole();
    if(role === 'admin' || role === 'User' || role === null){
      this.snackBar.open("Unauthorized" , 'Close' , {
        duration:5000,
      });
        this.router.navigate(['/login']);
        return;
    }

    this.getAllAccounts();
    
  }



  checkRole(): string | null {
    this.loggedUser = localStorage.getItem('currentUser');
    
    if (this.loggedUser) {
      try {
        const token = JSON.parse(atob(this.loggedUser.split('.')[1])); 
        return token.role || null; 
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  } 
//====================================================================
  getAllAccounts():void{

    this.adminService.getAllAccounts().subscribe(
      (response: any[])=>{
        this.accounts = new MatTableDataSource(response);
        console.log(response);
        this.snackBar.open("Details Fetched" , 'Close' , {
          duration:5000,
        });
      },
      (error)=>{
        console.log(error);
        this.errorHandler(error);
      }

    )
}

deleteAccount(emailId: string): void {
  const confirmation = confirm("Are you sure you want to delete this account?");
  if(confirmation){
  this.adminService.deleteAccount(emailId).subscribe(
    (success:any)=>{
      this.snackBar.open('Account deleted successfully', 'Close', {duration: 2000,});
      this.getAllAccounts();
    },
    (error:any)=>{
      this.snackBar.open('Something Went Wrong', 'Close', {duration: 2000,});
    }
  );
}else{
  this.snackBar.open('You Clicked Cancel', 'Close', {duration: 2000,});

}

}


errorHandler(error:any){
  if(error.status === 401 || error.status === 403 ||  error.status === 404)
    {
    this.snackBar.open("Either Token Expired or You are not Authorized to access" , 'Close' , {
      duration:5000, panelClass:['mat-primary']
    });
  }

}
}