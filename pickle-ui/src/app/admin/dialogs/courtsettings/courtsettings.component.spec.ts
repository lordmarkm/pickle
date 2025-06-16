import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtsettingsComponent } from './courtsettings.component';

describe('CourtsettingsComponent', () => {
  let component: CourtsettingsComponent;
  let fixture: ComponentFixture<CourtsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtsettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
