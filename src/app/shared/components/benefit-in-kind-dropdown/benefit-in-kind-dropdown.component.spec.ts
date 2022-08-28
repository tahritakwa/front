import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BenefitInKindDropdownComponent} from './benefit-in-kind-dropdown.component';

describe('BenefitInKindDropdownComponent', () => {
  let component: BenefitInKindDropdownComponent;
  let fixture: ComponentFixture<BenefitInKindDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BenefitInKindDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitInKindDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
