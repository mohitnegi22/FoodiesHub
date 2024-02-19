import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../services/menu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {
  restaurantId: string;
  menu: any[] = [];
  addDishForm: FormGroup;
  updateDishForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private formBuilder: FormBuilder
  ) {
    this.addDishForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      rating: ['', Validators.required],
      image: ['', Validators.required],
      type: ['', Validators.required]
    });

    this.updateDishForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      rating: ['', Validators.required],
      image: ['', Validators.required],
      type: ['', Validators.required]
    });
  }



ngOnInit(): void {
  this.restaurantId = this.route.snapshot.paramMap.get('id');
  console.log('Restaurant ID:', this.restaurantId);
  this.fetchMenu();
}

fetchMenu() {
  this.menuService.getRestaurantMenu(this.restaurantId).subscribe(
    (menu) => {
      console.log('Fetched Menu:', menu);
      this.menu = menu;
    },
    (error) => {
      console.error('Error fetching menu:', error);
    }
  );
}

  

  addDish() {
    const newDish = this.addDishForm.value;
    this.menuService.addDishToMenu(this.restaurantId, newDish).subscribe(
      (updatedMenu) => {
        this.menu = updatedMenu;
        this.addDishForm.reset();
      },
      (error) => {
        console.error('Error adding dish:', error);
      }
    );
  }

  removeDish(dishId: string) {
    this.menuService.removeDishFromMenu(this.restaurantId, dishId).subscribe(
      (updatedMenu) => {
        this.menu = updatedMenu;
      },
      (error) => {
        console.error('Error removing dish:', error);
      }
    );
  }

  updateDish(dishId: string) {
    const updatedDish = this.updateDishForm.value;
    this.menuService.updateDishInMenu(this.restaurantId, dishId, updatedDish).subscribe(
      (updatedMenu) => {
        this.menu = updatedMenu;
        this.updateDishForm.reset();
      },
      (error) => {
        console.error('Error updating dish:', error);
      }
    );
  }
}
