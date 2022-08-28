import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserB2bSettingsComponent } from './user-b2b-settings.component';

describe('UserB2bSettingsComponent', () => {
  let component: UserB2bSettingsComponent;
  let fixture: ComponentFixture<UserB2bSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserB2bSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserB2bSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
