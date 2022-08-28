import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationToBePerformedComponent } from './operation-to-be-performed.component';

describe('OperationToBePerformedComponent', () => {
  let component: OperationToBePerformedComponent;
  let fixture: ComponentFixture<OperationToBePerformedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationToBePerformedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationToBePerformedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
