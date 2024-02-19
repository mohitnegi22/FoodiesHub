import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NightlifeComponent } from './nightlife.component';

describe('NightlifeComponent', () => {
  let component: NightlifeComponent;
  let fixture: ComponentFixture<NightlifeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NightlifeComponent]
    });
    fixture = TestBed.createComponent(NightlifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
