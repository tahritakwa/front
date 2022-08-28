import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelOfItemComboBoxComponent } from './model-of-item-combo-box.component';

describe('ModelOfItemComboBoxComponent', () => {
  let component: ModelOfItemComboBoxComponent;
  let fixture: ComponentFixture<ModelOfItemComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelOfItemComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelOfItemComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
