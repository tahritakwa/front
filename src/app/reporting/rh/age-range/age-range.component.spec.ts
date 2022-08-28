import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeRangeComponent } from './age-range.component';

describe('AgeRangeComponent', () => {
  let component: AgeRangeComponent;
  let fixture: ComponentFixture<AgeRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
