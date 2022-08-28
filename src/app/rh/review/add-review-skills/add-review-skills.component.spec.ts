import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddReviewSkillsComponent} from './add-review-skills.component';

describe('AddReviewSkillsComponent', () => {
  let component: AddReviewSkillsComponent;
  let fixture: ComponentFixture<AddReviewSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddReviewSkillsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReviewSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
