import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTierActivitiesComponent } from './profile-tier-activities.component';

describe('ProfileTierActivitiesComponent', () => {
  let component: ProfileTierActivitiesComponent;
  let fixture: ComponentFixture<ProfileTierActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTierActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTierActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
