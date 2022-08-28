import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOutstandingDocumentComponent } from './customer-outstanding-document.component';

describe('CustomerOutstandingDocumentComponent', () => {
  let component: CustomerOutstandingDocumentComponent;
  let fixture: ComponentFixture<CustomerOutstandingDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOutstandingDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOutstandingDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
