import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterZoneComponent } from './cash-register-zone.component';

describe('CashRegisterZoneComponent', () => {
  let component: CashRegisterZoneComponent;
  let fixture: ComponentFixture<CashRegisterZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
