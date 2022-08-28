import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureUnitListComponent } from './measure-unit-list.component';

describe('AddMeasureUnitComponent', () => {
  let component: MeasureUnitListComponent;
  let fixture: ComponentFixture<MeasureUnitListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureUnitListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureUnitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
