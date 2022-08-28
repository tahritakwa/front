import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddSourceDeductionSessionComponent} from './add-source-deduction-session.component';

describe('AddSourceDeductionComponent', () => {
  let component: AddSourceDeductionSessionComponent;
  let fixture: ComponentFixture<AddSourceDeductionSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSourceDeductionSessionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSourceDeductionSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
