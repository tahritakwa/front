import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateOfJournalsComponent } from './state-of-journals.component';

describe('StateOfJournalsComponent', () => {
  let component: StateOfJournalsComponent;
  let fixture: ComponentFixture<StateOfJournalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateOfJournalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateOfJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
