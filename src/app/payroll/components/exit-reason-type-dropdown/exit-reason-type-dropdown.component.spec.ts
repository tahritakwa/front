import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExitReasonTypeDropdownComponent} from './exit-reason-type-dropdown.component';

describe('ExitReasonTypeDropdownComponent', () => {
  let component: ExitReasonTypeDropdownComponent;
  let fixture: ComponentFixture<ExitReasonTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExitReasonTypeDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitReasonTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
