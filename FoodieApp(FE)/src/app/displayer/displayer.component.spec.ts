import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayerComponent } from './displayer.component';

describe('DisplayerComponent', () => {
  let component: DisplayerComponent;
  let fixture: ComponentFixture<DisplayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayerComponent]
    });
    fixture = TestBed.createComponent(DisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
