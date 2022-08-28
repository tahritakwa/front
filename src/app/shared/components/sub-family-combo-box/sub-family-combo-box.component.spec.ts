import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFamilyComboBoxComponent } from './sub-family-combo-box.component';

describe('SubFamilyComboBoxComponent', () => {
  let component: SubFamilyComboBoxComponent;
  let fixture: ComponentFixture<SubFamilyComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubFamilyComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubFamilyComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
