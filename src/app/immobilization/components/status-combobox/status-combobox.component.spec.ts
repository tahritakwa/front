import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusComboboxComponent } from './status-combobox.component';

describe('StatusComboboxComponent', () => {
  let component: StatusComboboxComponent;
  let fixture: ComponentFixture<StatusComboboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusComboboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
