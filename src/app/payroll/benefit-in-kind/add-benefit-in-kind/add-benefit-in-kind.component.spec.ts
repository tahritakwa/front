import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddBenefitInKindComponent} from './add-benefit-in-kind.component';

describe('AddBenefitInKindComponent', () => {
  let component: AddBenefitInKindComponent;
  let fixture: ComponentFixture<AddBenefitInKindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBenefitInKindComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBenefitInKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
