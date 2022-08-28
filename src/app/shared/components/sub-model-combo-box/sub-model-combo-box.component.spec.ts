import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubModelComboBoxComponent } from './sub-model-combo-box.component';

describe('SubModelComboBoxComponent', () => {
  let component: SubModelComboBoxComponent;
  let fixture: ComponentFixture<SubModelComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubModelComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubModelComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
