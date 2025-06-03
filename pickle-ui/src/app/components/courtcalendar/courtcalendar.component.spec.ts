import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtcalendarComponent } from './courtcalendar.component';

describe('CourtcalendarComponent', () => {
  let component: CourtcalendarComponent;
  let fixture: ComponentFixture<CourtcalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtcalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
