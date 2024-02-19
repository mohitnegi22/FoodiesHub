import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestaurantService } from '../services/restaurant.service';
import { Feedback } from '../models/feedback';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css']
})
export class FeedbackDialogComponent {
  emailId:string = '';

  feedback: Feedback = {
    emailId: "",
    reaction: "",
    suggestion: "",
    orderid: ""
  };
  constructor(public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    private restaurantService:RestaurantService,  private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: { orderId: string }) 
    {    this.feedback.emailId = this.getEmailId() || '';  }
  
  onReactionClick(reaction: string) {
    console.log('User clicked:', reaction);
    this.feedback.reaction = reaction;

    this.snackBar.open(`You selected: ${reaction}`, 'Close', {
      duration: 2000,
    });
  }
  //================================================================
  submitFeedback()  {

    const feedbackData: Feedback = {
      emailId: this.feedback.emailId,
      reaction: this.feedback.reaction,
      suggestion: this.feedback.suggestion,
      orderid: localStorage.getItem("currentOrderId")
    };
    
    console.log("feedback data after adding orderid = ", feedbackData);

    this.restaurantService.submitFeedback(feedbackData).subscribe(
      (response: any) => {
        console.log('Feedback submitted successfully:', response);
        this.dialogRef.close();
        this.snackBar.open('feedback Submitted', 'Close', { duration: 3000 });

      },
      (error: any) => {
        console.error('Error submitting feedback:', error);
      }
    );
  
}
  closeDialog(): void {
    this.dialogRef.close();
    this.snackBar.open('No feedback Submitted, Thank you for using our services', 'Close', { duration: 3000 });
  }

  getEmailId(): string | null {
    this.emailId = localStorage.getItem('currentUser');

    if (this.emailId) {
      try {
        const tokenPayload = JSON.parse(atob(this.emailId.split('.')[1])); 
        
        console.log("emailId decoded from token for feedback = " + tokenPayload.emailId);
        return tokenPayload.emailId || null; 
        
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  }
}
