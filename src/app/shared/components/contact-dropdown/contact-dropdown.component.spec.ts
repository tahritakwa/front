import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDropdownComponent } from './contact-dropdown.component';

describe('ContactDropdownComponent', () => {
  let component: ContactDropdownComponent;
  let fixture: ComponentFixture<ContactDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
