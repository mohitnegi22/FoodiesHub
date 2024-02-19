import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Displayer2Component } from './displayer2.component';

describe('Displayer2Component', () => {
  let component: Displayer2Component;
  let fixture: ComponentFixture<Displayer2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Displayer2Component]
    });
    fixture = TestBed.createComponent(Displayer2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
