import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterableCheckBoxComponent } from './letterable-check-box.component';

describe('LetterableCheckBoxComponent', () => {
  let component: LetterableCheckBoxComponent;
  let fixture: ComponentFixture<LetterableCheckBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterableCheckBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterableCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
