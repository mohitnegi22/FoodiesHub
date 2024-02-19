import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appSuperPlaceholder]'
})
export class SuperPlaceholderDirective implements OnInit {
  @Input() private placeholders: string[] = ["Restaurants", "Cuisines", "Dish"];
  @Input() private preText: string = "Search for";

  private placeholderIdx: number = 0;
  private charIdx: number = 0;
  private intervalId: any;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    this.init();
  }

  private setPlaceholder() {
    const placeholder = this.placeholders[this.placeholderIdx];
    const placeholderChunk = placeholder.substring(0, this.charIdx + 1);
    this.el.nativeElement.placeholder = `${this.preText} ${placeholderChunk}`;
  }

  private onTickReverse(afterReverse: () => void) {
    if (this.charIdx === 0) {
      afterReverse.bind(this)();
      clearInterval(this.intervalId);
      this.init();
    } else {
      this.setPlaceholder();
      this.charIdx--;
    }
  }

  private goReverse() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.onTickReverse.bind(this, () => {
      this.charIdx = 0;
      this.placeholderIdx++;
      if (this.placeholderIdx === this.placeholders.length) {
        this.placeholderIdx = 0;
      }
    }), 100);
  }

  private onTick() {
    const placeholder = this.placeholders[this.placeholderIdx];
    if (this.charIdx === placeholder.length) {
      setTimeout(this.goReverse.bind(this), 500);
    }

    this.setPlaceholder();
    this.charIdx++;
  }

  private init() {
    this.intervalId = setInterval(this.onTick.bind(this), 100);
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    
    clearInterval(this.intervalId);
    this.el.nativeElement.style.border = 'none'; 
  
    if (value === '') {
      
      this.init();
    } else {
      this.el.nativeElement.placeholder = ''; 
    }
  }
  

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
