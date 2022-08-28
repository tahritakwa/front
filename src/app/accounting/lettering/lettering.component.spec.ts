import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetteringComponent } from './lettering.component';

describe('LetteringComponent', () => {
  let component: LetteringComponent;
  let fixture: ComponentFixture<LetteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
