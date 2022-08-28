import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDocumentStatusComponent } from './invoice-document-status.component';

describe('InvoiceDocumentStatusComponent', () => {
  let component: InvoiceDocumentStatusComponent;
  let fixture: ComponentFixture<InvoiceDocumentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceDocumentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDocumentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
