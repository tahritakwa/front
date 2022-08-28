import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormationTypeComboboxComponent} from './formation-type-combobox.component';

describe('FormationTypeComboboxComponent', () => {
  let component: FormationTypeComboboxComponent;
  let fixture: ComponentFixture<FormationTypeComboboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormationTypeComboboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationTypeComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
