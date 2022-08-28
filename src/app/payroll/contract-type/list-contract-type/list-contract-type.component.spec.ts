import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListContractTypeComponent} from './list-contract-type.component';

describe('ListContractTypeComponent', () => {
  let component: ListContractTypeComponent;
  let fixture: ComponentFixture<ListContractTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListContractTypeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContractTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
