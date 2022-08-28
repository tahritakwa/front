import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLoanVehicleComponent } from './add-loan-vehicle.component';

describe('AddLoanVehicleComponent', () => {
  let component: AddLoanVehicleComponent;
  let fixture: ComponentFixture<AddLoanVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLoanVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLoanVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
