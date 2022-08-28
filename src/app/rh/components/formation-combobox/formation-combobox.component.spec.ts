import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormationComboboxComponent} from './formation-combobox.component';

describe('FormationComboboxComponent', () => {
  let component: FormationComboboxComponent;
  let fixture: ComponentFixture<FormationComboboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormationComboboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormationComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
