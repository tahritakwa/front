import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagerTreasuryComponent } from './pager-treasury.component';

describe('PagerTreasuryComponent', () => {
  let component: PagerTreasuryComponent;
  let fixture: ComponentFixture<PagerTreasuryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagerTreasuryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagerTreasuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
