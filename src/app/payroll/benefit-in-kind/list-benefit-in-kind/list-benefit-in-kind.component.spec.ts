import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListBenefitInKindComponent} from './list-benefit-in-kind.component';

describe('ListBenefitInKindComponent', () => {
  let component: ListBenefitInKindComponent;
  let fixture: ComponentFixture<ListBenefitInKindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListBenefitInKindComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBenefitInKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
