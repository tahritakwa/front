import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiersReceivablesComponent } from './tiers-receivables.component';

describe('TiersReceivablesComponent', () => {
  let component: TiersReceivablesComponent;
  let fixture: ComponentFixture<TiersReceivablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiersReceivablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiersReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
