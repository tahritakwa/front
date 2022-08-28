import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSourceDeductionComponent} from './list-source-deduction.component';

describe('ListSourceDeductionComponent', () => {
  let component: ListSourceDeductionComponent;
  let fixture: ComponentFixture<ListSourceDeductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSourceDeductionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSourceDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
