import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutcalendarComponent } from './checkoutcalendar.component';

describe('CheckoutcalendarComponent', () => {
  let component: CheckoutcalendarComponent;
  let fixture: ComponentFixture<CheckoutcalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutcalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
