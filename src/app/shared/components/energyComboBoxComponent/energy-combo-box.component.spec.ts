import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyComboBoxComponent } from './energy-combo-box.component';

describe('EnergyComboBoxComponent', () => {
  let component: EnergyComboBoxComponent;
  let fixture: ComponentFixture<EnergyComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
