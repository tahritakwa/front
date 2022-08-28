import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpSelectedFinancialCommitmentComponent } from './pop-up-selected-financial-commitment.component';

describe('PopUpSelectedFinancialCommitmentComponent', () => {
  let component: PopUpSelectedFinancialCommitmentComponent;
  let fixture: ComponentFixture<PopUpSelectedFinancialCommitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpSelectedFinancialCommitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpSelectedFinancialCommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
