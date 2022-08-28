import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractBonusValidityComponent } from './contract-bonus-validity.component';

describe('ContractBonusValidityComponent', () => {
  let component: ContractBonusValidityComponent;
  let fixture: ComponentFixture<ContractBonusValidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractBonusValidityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractBonusValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
