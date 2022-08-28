import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRelatedItemsComponent } from './contact-related-items.component';

describe('ContactRelatedItemsComponent', () => {
  let component: ContactRelatedItemsComponent;
  let fixture: ComponentFixture<ContactRelatedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactRelatedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRelatedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
