import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricLetteringComponent } from './historic-lettering.component';

describe('HistoricLetteringComponent', () => {
  let component: HistoricLetteringComponent;
  let fixture: ComponentFixture<HistoricLetteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricLetteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricLetteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
