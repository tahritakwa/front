import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVehicleHistoryComponent } from './customer-vehicle-history.component';

describe('CustomerVehicleHistoryComponent', () => {
  let component: CustomerVehicleHistoryComponent;
  let fixture: ComponentFixture<CustomerVehicleHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerVehicleHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerVehicleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
