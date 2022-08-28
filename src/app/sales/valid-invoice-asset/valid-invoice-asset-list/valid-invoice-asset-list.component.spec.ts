import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidInvoiceAssetListComponent } from './valid-invoice-asset-list.component';

describe('ValidInvoiceAssetListComponent', () => {
  let component: ValidInvoiceAssetListComponent;
  let fixture: ComponentFixture<ValidInvoiceAssetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidInvoiceAssetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidInvoiceAssetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
