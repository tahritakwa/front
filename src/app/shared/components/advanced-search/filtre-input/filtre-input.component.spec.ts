import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreInputComponent } from './filtre-input.component';

describe('FiltreInputComponent', () => {
  let component: FiltreInputComponent;
  let fixture: ComponentFixture<FiltreInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltreInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltreInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
