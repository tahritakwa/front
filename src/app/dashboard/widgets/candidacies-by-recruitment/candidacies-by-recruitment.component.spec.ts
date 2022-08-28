import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaciesByRecruitmentComponent } from './candidacies-by-recruitment.component';

describe('CandidaciesByRecruitmentComponent', () => {
  let component: CandidaciesByRecruitmentComponent;
  let fixture: ComponentFixture<CandidaciesByRecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidaciesByRecruitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidaciesByRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
