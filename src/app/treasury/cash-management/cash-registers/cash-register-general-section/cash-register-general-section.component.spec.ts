import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterGeneralSectionComponent } from './cash-register-general-section.component';

describe('CashRegisterGeneralSectionComponent', () => {
  let component: CashRegisterGeneralSectionComponent;
  let fixture: ComponentFixture<CashRegisterGeneralSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterGeneralSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterGeneralSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
