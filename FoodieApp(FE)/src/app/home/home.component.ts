import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';

import { DeliveryComponent } from '../delivery/delivery.component';
import { DiningoutComponent } from '../diningout/diningout.component';
import { NightlifeComponent } from '../nightlife/nightlife.component';

@Component({
  selector: 'app-home',
  template: `
    <app-header></app-header>
    <app-displayer></app-displayer>
    <app-displayer2 (imageSelected)="loadComponent($event)"></app-displayer2>
    <ng-container #dynamicComponentContainer></ng-container>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
  dynamicComponentContainer: ViewContainerRef;

  constructor(
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  loadComponent(component: string): void {
    // Clear previous component
    this.dynamicComponentContainer.clear();

    let componentFactory;
    switch (component) {
      case 'delivery':
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          DeliveryComponent
        );
        break;
      case 'diningout':
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          DiningoutComponent
        );
        break;
      case 'nightlife':
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          NightlifeComponent
        );
        break;
      default:
        break;
    }

    if (componentFactory) {
      const componentRef = this.dynamicComponentContainer.createComponent(
        componentFactory
      );
      // You can access the instance of the component if needed
      // const instance = componentRef.instance;
    }
  }
}
