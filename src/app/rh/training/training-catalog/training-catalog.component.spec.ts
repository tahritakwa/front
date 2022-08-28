import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TrainingCatalogComponent} from './training-catalog.component';

describe('TrainingCatalogComponent', () => {
  let component: TrainingCatalogComponent;
  let fixture: ComponentFixture<TrainingCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingCatalogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
