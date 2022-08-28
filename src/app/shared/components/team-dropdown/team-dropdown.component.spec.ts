import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TeamDropdownComponent} from './team-dropdown.component';

describe('TeamDropdownComponent', () => {
  let component: TeamDropdownComponent;
  let fixture: ComponentFixture<TeamDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeamDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
