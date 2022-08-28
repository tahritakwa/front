import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermBillingGridComponent } from './term-billing-grid.component';

describe('TermBillingGridComponent', () => {
  let component: TermBillingGridComponent;
  let fixture: ComponentFixture<TermBillingGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermBillingGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermBillingGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
