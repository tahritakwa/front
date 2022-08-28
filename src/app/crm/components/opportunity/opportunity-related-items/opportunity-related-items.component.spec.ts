import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityRelatedItemsComponent } from './opportunity-related-items.component';

describe('OpportunityRelatedItemsComponent', () => {
  let component: OpportunityRelatedItemsComponent;
  let fixture: ComponentFixture<OpportunityRelatedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityRelatedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityRelatedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
