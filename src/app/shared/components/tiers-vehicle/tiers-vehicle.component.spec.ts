import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiersvehicleComponent } from './tiers-vehicle.component';

describe('TiersvehicleComponent', () => {
  let component: TiersvehicleComponent;
  let fixture: ComponentFixture<TiersvehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiersvehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiersvehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
