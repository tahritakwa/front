import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithHoldingTaxTypeComponent } from './with-holding-tax-type.component';

describe('WithHoldingTaxTypeComponent', () => {
  let component: WithHoldingTaxTypeComponent;
  let fixture: ComponentFixture<WithHoldingTaxTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithHoldingTaxTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithHoldingTaxTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
