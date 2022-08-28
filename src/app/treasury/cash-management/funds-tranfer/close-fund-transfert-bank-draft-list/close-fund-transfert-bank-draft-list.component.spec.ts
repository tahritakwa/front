import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseFundTransfertBankDraftListComponent } from './close-fund-transfert-bank-draft-list.component';

describe('CloseFundTransfertBankDraftListComponent', () => {
  let component: CloseFundTransfertBankDraftListComponent;
  let fixture: ComponentFixture<CloseFundTransfertBankDraftListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseFundTransfertBankDraftListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseFundTransfertBankDraftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
