import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddReviewNotificationDaysComponent} from './add-review-notification-days.component';

describe('AddReviewNotificationDaysComponent', () => {
  let component: AddReviewNotificationDaysComponent;
  let fixture: ComponentFixture<AddReviewNotificationDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddReviewNotificationDaysComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReviewNotificationDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
