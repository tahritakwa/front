import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRoleConfigComponent } from './search-role-config.component';

describe('SearchRoleConfigComponent', () => {
  let component: SearchRoleConfigComponent;
  let fixture: ComponentFixture<SearchRoleConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchRoleConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRoleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
