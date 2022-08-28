import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomerVehicleComponent } from './list-customer-vehicle.component';

describe('ListCustomerVehicleComponent', () => {
  let component: ListCustomerVehicleComponent;
  let fixture: ComponentFixture<ListCustomerVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCustomerVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCustomerVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
