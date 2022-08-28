import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CandidacySteperComponent} from './candidacy-steper.component';

describe('CandidacySteperComponent', () => {
  let component: CandidacySteperComponent;
  let fixture: ComponentFixture<CandidacySteperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CandidacySteperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidacySteperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
