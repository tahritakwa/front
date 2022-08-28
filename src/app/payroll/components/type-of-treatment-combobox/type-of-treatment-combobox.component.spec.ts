import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TypeOfTreatmentComboboxComponent} from './type-of-treatment-combobox.component';

describe('TypeOfTreatmentComboboxComponent', () => {
  let component: TypeOfTreatmentComboboxComponent;
  let fixture: ComponentFixture<TypeOfTreatmentComboboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TypeOfTreatmentComboboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfTreatmentComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
