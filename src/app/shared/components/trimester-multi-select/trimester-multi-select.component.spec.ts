import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrimesterMultiSelectComponent } from './trimester-multi-select.component';

describe('TrimesterMultiSelectComponent', () => {
  let component: TrimesterMultiSelectComponent;
  let fixture: ComponentFixture<TrimesterMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrimesterMultiSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrimesterMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
