import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermBillingListComponent } from './term-billing-list.component';

describe('TermBillingListComponent', () => {
  let component: TermBillingListComponent;
  let fixture: ComponentFixture<TermBillingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermBillingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermBillingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
