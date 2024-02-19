import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-displayer2',
  templateUrl: './displayer2.component.html',
  styleUrls: ['./displayer2.component.css']
})
export class Displayer2Component implements OnInit{
  images = [
    { src: '../../assets/delivery1.webp', alt: 'Delivery', altColor: 'red', route: 'delivery' },
    { src: '../../assets/diningout1.avif', alt: 'Dining Out', altColor: 'red', route: 'diningout' },
    { src: '../../assets/nightlife.webp', alt: 'Nightlife', altColor: 'red', route: 'nightlife' }
  ];

  alternateImages = [
    '../../assets/delivery2.avif',
    '../../assets/diningout2.avif',
    '../../assets/nightlife2.webp'
  ];

  selectedImageIndex: number | null = null;

  constructor(private router: Router) {} 

  @Output() imageSelected = new EventEmitter<string>();
  @Output() restaurantChange = new EventEmitter<void>();

  ngOnInit(): void {
    // Set 'delivery' as the default selected image
    this.selectedImageIndex = 0; // Index of the 'delivery' image in the 'images' array
    this.imageSelected.emit('delivery');
  }

  onSelect(index: number): void {
    // Toggle between original and alternate images
    this.selectedImageIndex = this.selectedImageIndex === index ? null : index;

    if (this.selectedImageIndex !== null) {
      const selectedRoute = this.images[index].route;
      this.imageSelected.emit(selectedRoute);
      this.restaurantChange.emit();
    } else {
      // Default to 'delivery' if no image is selected
      this.imageSelected.emit('delivery');
    }
  }
}