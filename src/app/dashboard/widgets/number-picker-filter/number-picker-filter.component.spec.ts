import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberPickerFilterComponent } from './number-picker-filter.component';

describe('NumberPickerFilterComponent', () => {
  let component: NumberPickerFilterComponent;
  let fixture: ComponentFixture<NumberPickerFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberPickerFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberPickerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
