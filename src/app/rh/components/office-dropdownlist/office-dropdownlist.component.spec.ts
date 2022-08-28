import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OfficeDropdownlistComponent} from './office-dropdownlist.component';

describe('OfficeDropdownlistComponent', () => {
  let component: OfficeDropdownlistComponent;
  let fixture: ComponentFixture<OfficeDropdownlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfficeDropdownlistComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeDropdownlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
