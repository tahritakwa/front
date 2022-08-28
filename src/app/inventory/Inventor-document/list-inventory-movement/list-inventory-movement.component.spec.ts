import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInventoryMovementComponent } from './list-inventory-movement.component';

describe('ListInventoryMovementComponent', () => {
  let component: ListInventoryMovementComponent;
  let fixture: ComponentFixture<ListInventoryMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInventoryMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
