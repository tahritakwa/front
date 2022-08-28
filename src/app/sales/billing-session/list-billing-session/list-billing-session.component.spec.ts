import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBillingSessionComponent } from './list-billing-session.component';

describe('ListBillingSessionComponent', () => {
  let component: ListBillingSessionComponent;
  let fixture: ComponentFixture<ListBillingSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBillingSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBillingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
