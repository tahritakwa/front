import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleConfigMultiselectComponent } from './role-config-multiselect.component';

describe('RoleConfigMultiselectComponent', () => {
  let component: RoleConfigMultiselectComponent;
  let fixture: ComponentFixture<RoleConfigMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleConfigMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleConfigMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
