import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseFundTransfertVoucherListComponent } from './close-fund-transfert-voucher-list.component';

describe('CloseFundTransfertVoucherListComponent', () => {
  let component: CloseFundTransfertVoucherListComponent;
  let fixture: ComponentFixture<CloseFundTransfertVoucherListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseFundTransfertVoucherListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseFundTransfertVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
