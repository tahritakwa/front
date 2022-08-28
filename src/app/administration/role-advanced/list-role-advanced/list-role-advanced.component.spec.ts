import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRoleAdvancedComponent } from './list-role-advanced.component';

describe('ListRoleAdvanced', () => {
  let component: ListRoleAdvancedComponent;
  let fixture: ComponentFixture<ListRoleAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRoleAdvancedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRoleAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
