import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RecruitmentResumeComponent} from './recruitment-resume.component';

describe('RecruitmentResumeComponent', () => {
  let component: RecruitmentResumeComponent;
  let fixture: ComponentFixture<RecruitmentResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecruitmentResumeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
