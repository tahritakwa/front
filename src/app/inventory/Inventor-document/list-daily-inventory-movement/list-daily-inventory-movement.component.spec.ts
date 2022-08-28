import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListDailyInventoryMovementComponent } from './list-daily-inventory-movement.component';

describe('ListDailyInventoryMovementComponent', () => {
  let component: ListDailyInventoryMovementComponent;
  let fixture: ComponentFixture<ListDailyInventoryMovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDailyInventoryMovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDailyInventoryMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
