import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrePredicateComponent } from './filtre-predicate.component';

describe('FiltrePredicateDropdownComponent', () => {
  let component: FiltrePredicateComponent;
  let fixture: ComponentFixture<FiltrePredicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrePredicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrePredicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
