import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSourceDeductionSessionComponent} from './list-source-deduction-session.component';

describe('ListSourceDeductionSessionComponent', () => {
  let component: ListSourceDeductionSessionComponent;
  let fixture: ComponentFixture<ListSourceDeductionSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSourceDeductionSessionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSourceDeductionSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
