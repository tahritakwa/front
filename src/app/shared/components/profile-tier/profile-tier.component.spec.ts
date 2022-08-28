import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTierComponent } from './profile-tier.component';

describe('ProfileTierComponent', () => {
  let component: ProfileTierComponent;
  let fixture: ComponentFixture<ProfileTierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
