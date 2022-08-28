import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmDropdownComponent } from './crm-dropdown.component';

describe('CrmDropdownComponent', () => {
  let component: CrmDropdownComponent;
  let fixture: ComponentFixture<CrmDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
