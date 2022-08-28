import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListLoanInstallmentComponent} from './list-loan-installment.component';

describe('ListLoanInstallmentComponent', () => {
  let component: ListLoanInstallmentComponent;
  let fixture: ComponentFixture<ListLoanInstallmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListLoanInstallmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLoanInstallmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
