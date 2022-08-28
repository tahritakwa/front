import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLoanVehicleComponent } from './list-loan-vehicle.component';

describe('ListLoanVehicleComponent', () => {
  let component: ListLoanVehicleComponent;
  let fixture: ComponentFixture<ListLoanVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLoanVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLoanVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
