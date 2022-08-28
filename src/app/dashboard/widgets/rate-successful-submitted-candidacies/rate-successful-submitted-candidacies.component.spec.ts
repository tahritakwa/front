import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateSuccessfulSubmittedCandidaciesComponent } from './rate-successful-submitted-candidacies.component';

describe('RateSuccessfulSubmittedCandidaciesComponent', () => {
  let component: RateSuccessfulSubmittedCandidaciesComponent;
  let fixture: ComponentFixture<RateSuccessfulSubmittedCandidaciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateSuccessfulSubmittedCandidaciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateSuccessfulSubmittedCandidaciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
