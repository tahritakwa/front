import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusAccountedDropdownComponent } from './status-accounted-dropdown.component';

describe('StatusAccountedDropdownComponent', () => {
  let component: StatusAccountedDropdownComponent;
  let fixture: ComponentFixture<StatusAccountedDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusAccountedDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAccountedDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
