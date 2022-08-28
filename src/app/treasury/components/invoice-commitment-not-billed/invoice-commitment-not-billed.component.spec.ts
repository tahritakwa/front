import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCommitmentNotBilledComponent } from './invoice-commitment-not-billed.component';

describe('InvoiceCommitmentNotBilledComponent', () => {
  let component: InvoiceCommitmentNotBilledComponent;
  let fixture: ComponentFixture<InvoiceCommitmentNotBilledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceCommitmentNotBilledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCommitmentNotBilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
