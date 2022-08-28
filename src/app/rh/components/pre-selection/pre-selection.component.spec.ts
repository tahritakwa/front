import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PreSelectionComponent} from './pre-selection.component';

describe('PreSelectionComponent', () => {
  let component: PreSelectionComponent;
  let fixture: ComponentFixture<PreSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreSelectionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
