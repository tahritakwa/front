import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFinancialCommitmentNotBilledComponent } from './invoice-financial-commitment-not-billed.component';

describe('InvoiceFinancialCommitmentNotBilledComponent', () => {
  let component: InvoiceFinancialCommitmentNotBilledComponent;
  let fixture: ComponentFixture<InvoiceFinancialCommitmentNotBilledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceFinancialCommitmentNotBilledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFinancialCommitmentNotBilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
