import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTypeDropdownComponent } from './team-type-dropdown.component';

describe('TeamTypeDropdownComponent', () => {
  let component: TeamTypeDropdownComponent;
  let fixture: ComponentFixture<TeamTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
