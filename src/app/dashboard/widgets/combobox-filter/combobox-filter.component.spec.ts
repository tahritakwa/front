import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxFilterComponent } from './combobox-filter.component';

describe('ComboboxFilterComponent', () => {
  let component: ComboboxFilterComponent;
  let fixture: ComponentFixture<ComboboxFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboboxFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboboxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
