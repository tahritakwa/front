import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLanguagesDropdownComponent } from './user-languages-dropdown.component';

describe('UserLanguagesDropdownComponent', () => {
  let component: UserLanguagesDropdownComponent;
  let fixture: ComponentFixture<UserLanguagesDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLanguagesDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLanguagesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
