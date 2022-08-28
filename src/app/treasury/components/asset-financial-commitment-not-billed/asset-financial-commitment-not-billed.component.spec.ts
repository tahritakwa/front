import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFinancialCommitmentNotBilledComponent } from './asset-financial-commitment-not-billed.component';

describe('AssetFinancialCommitmentNotBilledComponent', () => {
  let component: AssetFinancialCommitmentNotBilledComponent;
  let fixture: ComponentFixture<AssetFinancialCommitmentNotBilledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetFinancialCommitmentNotBilledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetFinancialCommitmentNotBilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
