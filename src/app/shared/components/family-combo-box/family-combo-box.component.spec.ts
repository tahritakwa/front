import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyComboBoxComponent } from './family-combo-box.component';

describe('FamilyComboBoxComponent', () => {
  let component: FamilyComboBoxComponent;
  let fixture: ComponentFixture<FamilyComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
