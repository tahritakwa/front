import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMultiselectComponent } from './role-multiselect.component';

describe('RoleMultiselectComponent', () => {
  let component: RoleMultiselectComponent;
  let fixture: ComponentFixture<RoleMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMultiselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
