import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListDailySalesInventoryMovementComponent } from './list-daily-sales-inventory-movement.component';

describe('ListDailySalesInventoryMovementComponent', () => {
  let component: ListDailySalesInventoryMovementComponent;
  let fixture: ComponentFixture<ListDailySalesInventoryMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDailySalesInventoryMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDailySalesInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
