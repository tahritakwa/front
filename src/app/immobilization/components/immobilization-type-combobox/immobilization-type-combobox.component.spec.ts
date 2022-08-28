import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmobilizationTypeComboboxComponent } from './immobilization-type-combobox.component';

describe('ImmobilizationTypeComboboxComponent', () => {
  let component: ImmobilizationTypeComboboxComponent;
  let fixture: ComponentFixture<ImmobilizationTypeComboboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmobilizationTypeComboboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmobilizationTypeComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
