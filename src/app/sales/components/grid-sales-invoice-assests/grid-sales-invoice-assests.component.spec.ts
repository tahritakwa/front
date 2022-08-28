import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSalesInvoiceAssestsComponent } from './grid-sales-invoice-assests.component';

describe('GridSalesInvoiceAssestsComponent', () => {
  let component: GridSalesInvoiceAssestsComponent;
  let fixture: ComponentFixture<GridSalesInvoiceAssestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSalesInvoiceAssestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSalesInvoiceAssestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
