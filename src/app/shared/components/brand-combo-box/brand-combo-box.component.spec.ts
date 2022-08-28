import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandComboBoxComponent } from './brand-combo-box.component';

describe('BrandComboBoxComponent', () => {
  let component: BrandComboBoxComponent;
  let fixture: ComponentFixture<BrandComboBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandComboBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandComboBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
