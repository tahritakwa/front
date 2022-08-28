import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDetailSettlementComponent } from './show-detail-settlement.component';

describe('ShowDetailSettlementComponent', () => {
  let component: ShowDetailSettlementComponent;
  let fixture: ComponentFixture<ShowDetailSettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDetailSettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDetailSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
