import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionLoanVehicleStatusDropdownComponent } from './intervention-loan-vehicle-status-dropdown.component';

describe('InterventionLoanVehicleStatusDropdownComponent', () => {
  let component: InterventionLoanVehicleStatusDropdownComponent;
  let fixture: ComponentFixture<InterventionLoanVehicleStatusDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionLoanVehicleStatusDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionLoanVehicleStatusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
