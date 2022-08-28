import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTierLastArticlesComponent } from './profile-tier-last-articles.component';

describe('ProfileTierLastArticlesComponent', () => {
  let component: ProfileTierLastArticlesComponent;
  let fixture: ComponentFixture<ProfileTierLastArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTierLastArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTierLastArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
