import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterUserAddRoleComponent } from './master-user-add-role.component';

describe('MasterUserAddRoleComponent', () => {
  let component: MasterUserAddRoleComponent;
  let fixture: ComponentFixture<MasterUserAddRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterUserAddRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterUserAddRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
