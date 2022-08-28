import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanVehicleHistoryComponent } from './loan-vehicle-history.component';

describe('LoanVehicleHistoryComponent', () => {
  let component: LoanVehicleHistoryComponent;
  let fixture: ComponentFixture<LoanVehicleHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanVehicleHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanVehicleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
