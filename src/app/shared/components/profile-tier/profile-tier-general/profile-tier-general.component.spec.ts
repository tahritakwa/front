import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTierGeneralComponent } from './profile-tier-general.component';

describe('ProfileTierGeneralComponent', () => {
  let component: ProfileTierGeneralComponent;
  let fixture: ComponentFixture<ProfileTierGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTierGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTierGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
