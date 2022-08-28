import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRoleConfigComponent } from './list-role-config.component';

describe('ListRoleConfigComponent', () => {
  let component: ListRoleConfigComponent;
  let fixture: ComponentFixture<ListRoleConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRoleConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRoleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
