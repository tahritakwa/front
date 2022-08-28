import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRelatedItemsComponent } from './action-related-items.component';

describe('ActionRelatedItemsComponent', () => {
  let component: ActionRelatedItemsComponent;
  let fixture: ComponentFixture<ActionRelatedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionRelatedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionRelatedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
