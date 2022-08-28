import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCommitmentNotBilledComponent } from './financial-commitment-not-billed.component';

describe('FinancialCommitmentNotBilledComponent', () => {
  let component: FinancialCommitmentNotBilledComponent;
  let fixture: ComponentFixture<FinancialCommitmentNotBilledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialCommitmentNotBilledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialCommitmentNotBilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
