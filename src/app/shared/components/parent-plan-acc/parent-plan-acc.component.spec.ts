import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentPlanAccComponent } from './parent-plan-acc.component';

describe('ParentPlanAccComponent', () => {
  let component: ParentPlanAccComponent;
  let fixture: ComponentFixture<ParentPlanAccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentPlanAccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentPlanAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
