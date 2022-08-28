import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanFilterDropDownComponent } from './boolean-filter-drop-down.component';

describe('BooleanFilterDropDownComponent', () => {
  let component: BooleanFilterDropDownComponent;
  let fixture: ComponentFixture<BooleanFilterDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BooleanFilterDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooleanFilterDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
