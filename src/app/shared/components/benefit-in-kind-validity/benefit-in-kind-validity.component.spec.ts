import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BenefitInKindValidityComponent} from './benefit-in-kind-validity.component';

describe('BenefitInKindValidityComponent', () => {
  let component: BenefitInKindValidityComponent;
  let fixture: ComponentFixture<BenefitInKindValidityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BenefitInKindValidityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitInKindValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
