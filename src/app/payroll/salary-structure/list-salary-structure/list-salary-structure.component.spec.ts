import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSalaryStructureComponent} from './list-salary-structure.component';

describe('ListSalaryStructureComponent', () => {
  let component: ListSalaryStructureComponent;
  let fixture: ComponentFixture<ListSalaryStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSalaryStructureComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalaryStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
