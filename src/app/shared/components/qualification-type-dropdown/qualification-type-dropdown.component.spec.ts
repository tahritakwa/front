import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QualificationTypeDropdownComponent} from './qualification-type-dropdown.component';

describe('QualificationTypeDropdownComponent', () => {
  let component: QualificationTypeDropdownComponent;
  let fixture: ComponentFixture<QualificationTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QualificationTypeDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
