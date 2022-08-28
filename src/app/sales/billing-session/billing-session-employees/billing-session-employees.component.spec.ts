import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSessionEmployeesComponent } from './billing-session-employees.component';

describe('BillingSessionEmployeesComponent', () => {
  let component: BillingSessionEmployeesComponent;
  let fixture: ComponentFixture<BillingSessionEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSessionEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSessionEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
