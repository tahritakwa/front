import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingDropdownComponent} from './training-dropdown.component';

describe('TrainingDropdownComponent', () => {
  let component: TrainingDropdownComponent;
  let fixture: ComponentFixture<TrainingDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingDropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
