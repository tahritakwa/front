import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCashComponent } from './wallet-cash.component';

describe('WalletCashComponent', () => {
  let component: WalletCashComponent;
  let fixture: ComponentFixture<WalletCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
