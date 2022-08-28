import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterventionLoanVehicleComponent } from './add-intervention-loan-vehicle.component';

describe('AddInterventionLoanVehicleComponent', () => {
  let component: AddInterventionLoanVehicleComponent;
  let fixture: ComponentFixture<AddInterventionLoanVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInterventionLoanVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterventionLoanVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
