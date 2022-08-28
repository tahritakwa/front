import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrivilegeComponent } from './list-privilege.component';

describe('ListPrivilegeComponent', () => {
  let component: ListPrivilegeComponent;
  let fixture: ComponentFixture<ListPrivilegeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPrivilegeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
