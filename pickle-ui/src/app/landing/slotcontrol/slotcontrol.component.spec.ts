import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotcontrolComponent } from './slotcontrol.component';

describe('SlotcontrolComponent', () => {
  let component: SlotcontrolComponent;
  let fixture: ComponentFixture<SlotcontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlotcontrolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
