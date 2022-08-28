import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleConfigComponent } from './add-role-config.component';

describe('AddRoleConfigComponent', () => {
  let component: AddRoleConfigComponent;
  let fixture: ComponentFixture<AddRoleConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoleConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
