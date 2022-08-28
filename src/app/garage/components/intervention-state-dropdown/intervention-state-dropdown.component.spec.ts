import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionStateDropdownComponent } from './intervention-state-dropdown.component';

describe('InterventionStateDropdownComponent', () => {
  let component: InterventionStateDropdownComponent;
  let fixture: ComponentFixture<InterventionStateDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionStateDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionStateDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
