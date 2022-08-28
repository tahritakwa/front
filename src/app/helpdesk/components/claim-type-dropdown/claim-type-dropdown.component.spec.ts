import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimTypeDropdownComponent } from './claim-type-dropdown.component';

describe('ClaimTypeDropdownComponent', () => {
  let component: ClaimTypeDropdownComponent;
  let fixture: ComponentFixture<ClaimTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
