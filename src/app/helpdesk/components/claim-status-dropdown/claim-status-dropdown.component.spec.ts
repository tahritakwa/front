import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimStatusDropdownComponent } from './claim-status-dropdown.component';

describe('ClaimStatusDropdownComponent', () => {
  let component: ClaimStatusDropdownComponent;
  let fixture: ComponentFixture<ClaimStatusDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimStatusDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimStatusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
