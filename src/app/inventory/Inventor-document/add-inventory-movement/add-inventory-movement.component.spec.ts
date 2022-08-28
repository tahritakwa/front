import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryMovementComponent } from './add-inventory-movement.component';

describe('AddInventoryMovementComponent', () => {
  let component: AddInventoryMovementComponent;
  let fixture: ComponentFixture<AddInventoryMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInventoryMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
