import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatesToRememberDropDownComponent } from './dates-to-remember-drop-down.component';

describe('MarkingEventsDropDownComponent', () => {
  let component: DatesToRememberDropDownComponent;
  let fixture: ComponentFixture<DatesToRememberDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatesToRememberDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatesToRememberDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
