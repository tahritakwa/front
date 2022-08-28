import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMailingSettingsComponent } from './user-mailing-settings.component';

describe('UserMailingSettingsComponent', () => {
  let component: UserMailingSettingsComponent;
  let fixture: ComponentFixture<UserMailingSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMailingSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMailingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
