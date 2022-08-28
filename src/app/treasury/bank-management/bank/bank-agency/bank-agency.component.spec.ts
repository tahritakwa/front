import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAgencyComponent } from './bank-agency.component';

describe('BankAgencyComponent', () => {
  let component: BankAgencyComponent;
  let fixture: ComponentFixture<BankAgencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAgencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
