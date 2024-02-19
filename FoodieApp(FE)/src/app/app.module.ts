import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FooterComponent } from './footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpDialogComponent } from './otp-dialog/otp-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserDetailsComponent } from './user-details/user-details.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { DisplayerComponent } from './displayer/displayer.component';
import { Displayer2Component } from './displayer2/displayer2.component';
import { GeolocationService } from './services/geolocation.service';
import { SuperPlaceholderDirective } from './super-placeholder.directive';
import { DeliveryComponent } from './delivery/delivery.component';
import { DiningoutComponent } from './diningout/diningout.component';
import { NightlifeComponent } from './nightlife/nightlife.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { CartComponent } from './cart/cart.component';
import { MatTableModule } from '@angular/material/table';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { RestaurantOrdersComponent } from './restaurant-orders/restaurant-orders.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { FavouriteComponent } from './favourite/favourite.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { RazorpayComponent } from './razorpay/razorpay.component';
import { DishesComponent } from './dishes/dishes.component';
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatBadgeModule} from '@angular/material/badge';
import { Header2Component } from './header2/header2.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    OtpDialogComponent,
    UserDetailsComponent,
    HeaderComponent,
    HomeComponent,
    DisplayerComponent,
    Displayer2Component,
    SuperPlaceholderDirective,
    DeliveryComponent,
    DiningoutComponent,
    NightlifeComponent,
    RestaurantDetailsComponent,
    CartComponent,
    ForgotPasswordComponent,
    SuperAdminComponent,
    RestaurantOrdersComponent,
    AdminLoginComponent,
    FavouriteComponent,
    OrderHistoryComponent,
    RazorpayComponent,
    DishesComponent,
    FeedbackDialogComponent,
    ConfirmationDialogComponent,
    Header2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTabsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBadgeModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule ,
    MatCheckboxModule,
    MatToolbarModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
    MatTableModule,
    OAuthModule.forRoot(), 
  ],
  providers: [[GeolocationService]],
  bootstrap: [AppComponent]
})
export class AppModule { }
