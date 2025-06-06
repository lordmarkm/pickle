import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcontrolComponent } from './eventcontrol.component';

describe('EventcontrolComponent', () => {
  let component: EventcontrolComponent;
  let fixture: ComponentFixture<EventcontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventcontrolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
