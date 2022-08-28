import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRegisterInProgessSectionComponent } from './cash-register-in-progess-section.component';

describe('CashRegisterInProgessSectionComponent', () => {
  let component: CashRegisterInProgessSectionComponent;
  let fixture: ComponentFixture<CashRegisterInProgessSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashRegisterInProgessSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashRegisterInProgessSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
