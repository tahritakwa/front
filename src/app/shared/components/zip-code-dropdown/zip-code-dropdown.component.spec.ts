import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipCodeDropdownComponent } from './zip-code-dropdown.component';

describe('ZipCodeDropdownComponent', () => {
  let component: ZipCodeDropdownComponent;
  let fixture: ComponentFixture<ZipCodeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZipCodeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZipCodeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
