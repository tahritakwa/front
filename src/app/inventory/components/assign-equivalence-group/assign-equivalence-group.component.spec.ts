import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEquivalenceGroupComponent } from './assign-equivalence-group.component';

describe('AssignEquivalenceGroupComponent', () => {
  let component: AssignEquivalenceGroupComponent;
  let fixture: ComponentFixture<AssignEquivalenceGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignEquivalenceGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignEquivalenceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
