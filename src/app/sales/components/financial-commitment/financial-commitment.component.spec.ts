import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCommitmentComponent } from './financial-commitment.component';

describe('FinancialCommitmentComponent', () => {
  let component: FinancialCommitmentComponent;
  let fixture: ComponentFixture<FinancialCommitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialCommitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialCommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
