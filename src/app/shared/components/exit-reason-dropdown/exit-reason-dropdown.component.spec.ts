import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitReasonDropdownComponent } from './exit-reason-dropdown.component';

describe('ExitReasonDropdownComponent', () => {
  let component: ExitReasonDropdownComponent;
  let fixture: ComponentFixture<ExitReasonDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitReasonDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitReasonDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
