import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateOfAuxiliaryJournalsComponent } from './state-of-auxiliary-journals.component';

describe('StateOfAuxiliaryJournalsComponent', () => {
  let component: StateOfAuxiliaryJournalsComponent;
  let fixture: ComponentFixture<StateOfAuxiliaryJournalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateOfAuxiliaryJournalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateOfAuxiliaryJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
