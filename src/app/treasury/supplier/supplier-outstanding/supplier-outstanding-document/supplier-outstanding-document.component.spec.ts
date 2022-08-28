import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOutstandingDocumentComponent } from './supplier-outstanding-document.component';

describe('SupplierOutstandingDocumentComponent', () => {
  let component: SupplierOutstandingDocumentComponent;
  let fixture: ComponentFixture<SupplierOutstandingDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierOutstandingDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierOutstandingDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
