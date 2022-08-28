import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNegotiationComponent } from './list-negotiation.component';

describe('ListNegotiationComponent', () => {
  let component: ListNegotiationComponent;
  let fixture: ComponentFixture<ListNegotiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNegotiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
