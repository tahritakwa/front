import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListInterviewByRecruitmentComponent} from './list-interview-by-recruitment.component';

describe('ListInterviewByRecruitmentComponent', () => {
  let component: ListInterviewByRecruitmentComponent;
  let fixture: ComponentFixture<ListInterviewByRecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListInterviewByRecruitmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInterviewByRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
