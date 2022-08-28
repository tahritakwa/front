import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUserSettingsComponent } from './popup-user-settings.component';

describe('PopupUserSettingsComponent', () => {
  let component: PopupUserSettingsComponent;
  let fixture: ComponentFixture<PopupUserSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupUserSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupUserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
