import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvoiceAssetsComponent } from './list-invoice-assets.component';

describe('ListInvoiceAssetsComponent', () => {
  let component: ListInvoiceAssetsComponent;
  let fixture: ComponentFixture<ListInvoiceAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInvoiceAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvoiceAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
