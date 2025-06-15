import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockselectComponent } from './blockselect.component';

describe('BlockselectComponent', () => {
  let component: BlockselectComponent;
  let fixture: ComponentFixture<BlockselectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockselectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
