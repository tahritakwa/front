import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GradeDropdownComponent} from './grade-dropdown.component';

describe('GradeDropdownComponent', () => {
  let component: GradeDropdownComponent;
  let fixture: ComponentFixture<GradeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GradeDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
