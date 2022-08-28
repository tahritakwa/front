import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseFundTransfertBankCheckListComponent } from './close-fund-transfert-bank-check-list.component';

describe('CloseFundTransfertBankCheckListComponent', () => {
  let component: CloseFundTransfertBankCheckListComponent;
  let fixture: ComponentFixture<CloseFundTransfertBankCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseFundTransfertBankCheckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseFundTransfertBankCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
