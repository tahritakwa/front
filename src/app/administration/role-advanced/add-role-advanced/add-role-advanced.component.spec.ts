import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleAdvancedComponent } from './add-role-advanced.component';

describe('AddRoleAdvancedComponent', () => {
  let component: AddRoleAdvancedComponent;
  let fixture: ComponentFixture<AddRoleAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoleAdvancedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
