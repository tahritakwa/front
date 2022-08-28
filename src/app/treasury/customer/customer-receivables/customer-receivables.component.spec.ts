import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReceivablesComponent } from './customer-receivables.component';

describe('CustomerReceivablesComponent', () => {
  let component: CustomerReceivablesComponent;
  let fixture: ComponentFixture<CustomerReceivablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerReceivablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
