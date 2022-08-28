import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddReviewFormationComponent} from './add-review-formation.component';

describe('AddReviewFormationComponent', () => {
  let component: AddReviewFormationComponent;
  let fixture: ComponentFixture<AddReviewFormationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddReviewFormationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReviewFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
