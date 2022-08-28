import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiceAddComponent } from './purchase-invoice-add.component';

describe('PurchaseInvoiceAddComponent', () => {
  let component: PurchaseInvoiceAddComponent;
  let fixture: ComponentFixture<PurchaseInvoiceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseInvoiceAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInvoiceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
