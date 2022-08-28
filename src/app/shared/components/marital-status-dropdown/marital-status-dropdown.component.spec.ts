import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaritalStatusDropdownComponent } from './marital-status-dropdown.component';

describe('MaritalStatusDropdownComponent', () => {
  let component: MaritalStatusDropdownComponent;
  let fixture: ComponentFixture<MaritalStatusDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaritalStatusDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaritalStatusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
