import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationSalesAddComponent } from './quotation-sales-add.component';

describe('QuotationSalesAddComponent', () => {
  let component: QuotationSalesAddComponent;
  let fixture: ComponentFixture<QuotationSalesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationSalesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationSalesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
