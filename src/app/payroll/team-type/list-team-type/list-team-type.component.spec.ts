import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListTeamTypeComponent} from './list-team-type.component';

describe('ListTeamTypeComponent', () => {
  let component: ListTeamTypeComponent;
  let fixture: ComponentFixture<ListTeamTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListTeamTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTeamTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
