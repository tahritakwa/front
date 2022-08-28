import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalDropdownComponent } from './journal-dropdown.component';

describe('JournalDropdownComponent', () => {
  let component: JournalDropdownComponent;
  let fixture: ComponentFixture<JournalDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
