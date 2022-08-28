import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithholdingTaxConfigurationComponent } from './withholding-tax-configuration.component';

describe('WithholdingTaxConfigurationComponent', () => {
  let component: WithholdingTaxConfigurationComponent;
  let fixture: ComponentFixture<WithholdingTaxConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithholdingTaxConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithholdingTaxConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
