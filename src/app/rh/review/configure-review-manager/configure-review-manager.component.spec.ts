import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfigureReviewManagerComponent} from './configure-review-manager.component';

describe('ConfigureReviewManagerComponent', () => {
  let component: ConfigureReviewManagerComponent;
  let fixture: ComponentFixture<ConfigureReviewManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigureReviewManagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureReviewManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
