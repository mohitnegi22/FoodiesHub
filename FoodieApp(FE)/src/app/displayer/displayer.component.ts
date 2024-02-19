
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-displayer',
  templateUrl: './displayer.component.html',
  styleUrls: ['./displayer.component.css']
})
export class DisplayerComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  closeComponent() {
    this.close.emit();
  }
}
