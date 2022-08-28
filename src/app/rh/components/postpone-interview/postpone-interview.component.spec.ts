import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PostponeInterviewComponent} from './postpone-interview.component';

describe('PostponeInterviewComponent', () => {
  let component: PostponeInterviewComponent;
  let fixture: ComponentFixture<PostponeInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostponeInterviewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostponeInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
