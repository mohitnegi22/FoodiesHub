import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { HomeComponent } from './home/home.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { DiningoutComponent } from './diningout/diningout.component';
import { NightlifeComponent } from './nightlife/nightlife.component';
import { CartComponent } from './cart/cart.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { RestaurantOrdersComponent } from './restaurant-orders/restaurant-orders.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { CartDeactivateGuard } from './guards/cart-deactivate.guard';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DishesComponent } from './dishes/dishes.component';
import { LoginGuard } from './guards/login.guard';
import { UserAuthGuard } from './guards/user-auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';
// import { RazorpayComponent } from './razorpay/razorpay.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  { path: 'signup', component: SignupComponent },
  { path: 'restaurant/:id', component: RestaurantDetailsComponent },
  { path: 'delivery', component: DeliveryComponent },
  { path: 'diningout',component: DiningoutComponent},
  { path: 'nightlife', component: NightlifeComponent},
  { path: 'user-detail', component: UserDetailsComponent, canActivate: [UserAuthGuard]},
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [UserAuthGuard],
    canDeactivate: [CartDeactivateGuard],
  },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'super-admin', component: SuperAdminComponent},
  { path: 'restaurant-orders', component:RestaurantOrdersComponent, canActivate: [AdminAuthGuard]},
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [UserAuthGuard]},
  { path: 'favorite', component: FavouriteComponent, canActivate: [UserAuthGuard]},
  { path: 'orders', component: RestaurantOrdersComponent, canActivate: [AdminAuthGuard]},
  { path: 'admin-login', component: AdminLoginComponent, canActivate: [LoginGuard]},
  { path: 'dishes/:id', component: DishesComponent },
  // { path: 'razorpay/:orderId', component: RazorpayComponent },

  // { path: 'displayer2', component: Displayer2Component, outlet: 'secondOutlet', children: [
  //   { path: 'delivery', component: DeliveryComponent },
  //   { path: 'diningout', component: DiningoutComponent },
  //   { path: 'nightlife', component: NightlifeComponent },
  // ]},
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
