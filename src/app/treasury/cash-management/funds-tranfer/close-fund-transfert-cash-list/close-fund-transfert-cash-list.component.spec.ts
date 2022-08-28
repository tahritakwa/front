import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseFundTransfertCashListComponent } from './close-fund-transfert-cash-list.component';

describe('CloseFundTransfertCashListComponent', () => {
  let component: CloseFundTransfertCashListComponent;
  let fixture: ComponentFixture<CloseFundTransfertCashListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseFundTransfertCashListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseFundTransfertCashListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
