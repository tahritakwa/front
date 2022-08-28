import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleConfigCategoryDropdownComponent } from './role-config-category-dropdown.component';

describe('RoleConfigCategoryDropdownComponent', () => {
  let component: RoleConfigCategoryDropdownComponent;
  let fixture: ComponentFixture<RoleConfigCategoryDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleConfigCategoryDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleConfigCategoryDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
