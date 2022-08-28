import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPurchaseInvoiceAssestsBudgetComponent } from './grid-purchase-invoice-assests-budget.component';

describe('GridPurchaseInvoiceAssestsBudgetComponent', () => {
  let component: GridPurchaseInvoiceAssestsBudgetComponent;
  let fixture: ComponentFixture<GridPurchaseInvoiceAssestsBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridPurchaseInvoiceAssestsBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPurchaseInvoiceAssestsBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
