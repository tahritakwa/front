import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseRequestStatusDropdownComponent } from './purchase-request-status-dropdown.component';

describe('PurchaseRequestStatusDropdownComponent', () => {
  let component: PurchaseRequestStatusDropdownComponent;
  let fixture: ComponentFixture<PurchaseRequestStatusDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseRequestStatusDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseRequestStatusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
