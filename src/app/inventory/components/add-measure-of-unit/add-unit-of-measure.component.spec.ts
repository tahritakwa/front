import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitOfMeasureComponent } from './add-unit-of-measure.component';

describe('AddMeasureOfUnitComponent', () => {
  let component: AddUnitOfMeasureComponent;
  let fixture: ComponentFixture<AddUnitOfMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnitOfMeasureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnitOfMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
