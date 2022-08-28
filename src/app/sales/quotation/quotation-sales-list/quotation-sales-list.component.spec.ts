import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationSalesListComponent } from './quotation-sales-list.component';

describe('QuotationSalesListComponent', () => {
  let component: QuotationSalesListComponent;
  let fixture: ComponentFixture<QuotationSalesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationSalesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationSalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
