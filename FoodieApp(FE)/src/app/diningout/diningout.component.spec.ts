import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningoutComponent } from './diningout.component';

describe('DiningoutComponent', () => {
  let component: DiningoutComponent;
  let fixture: ComponentFixture<DiningoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiningoutComponent]
    });
    fixture = TestBed.createComponent(DiningoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
