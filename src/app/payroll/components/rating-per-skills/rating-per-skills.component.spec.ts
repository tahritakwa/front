import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RatingPerSkillsComponent} from './rating-per-skills.component';

describe('RatingPerSkillsComponent', () => {
  let component: RatingPerSkillsComponent;
  let fixture: ComponentFixture<RatingPerSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RatingPerSkillsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingPerSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
