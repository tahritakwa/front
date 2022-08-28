import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationHistoricComponent } from './reconciliation-historic.component';

describe('ReconciliationHistoricComponent', () => {
  let component: ReconciliationHistoricComponent;
  let fixture: ComponentFixture<ReconciliationHistoricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconciliationHistoricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
