import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanVehicleDropdownComponent } from './loan-vehicle-dropdown.component';

describe('LoanVehicleDropdownComponent', () => {
  let component: LoanVehicleDropdownComponent;
  let fixture: ComponentFixture<LoanVehicleDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanVehicleDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanVehicleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
