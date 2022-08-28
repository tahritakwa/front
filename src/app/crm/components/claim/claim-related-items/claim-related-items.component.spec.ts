import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRelatedItemsComponent } from './claim-related-items.component';

describe('ClaimRelatedItemsComponent', () => {
  let component: ClaimRelatedItemsComponent;
  let fixture: ComponentFixture<ClaimRelatedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimRelatedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRelatedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
