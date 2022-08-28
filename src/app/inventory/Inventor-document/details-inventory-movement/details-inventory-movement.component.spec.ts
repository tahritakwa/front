import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsInventoryMovementComponent } from './details-inventory-movement.component';

describe('DetailsInventoryMovementComponent', () => {
  let component: DetailsInventoryMovementComponent;
  let fixture: ComponentFixture<DetailsInventoryMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsInventoryMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
