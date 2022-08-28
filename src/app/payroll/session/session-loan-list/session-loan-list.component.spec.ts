import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SessionLoanListComponent} from './session-loan-list.component';

describe('SessionLoanListComponent', () => {
  let component: SessionLoanListComponent;
  let fixture: ComponentFixture<SessionLoanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SessionLoanListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionLoanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
