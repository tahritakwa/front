import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagerCrmComponent } from './pager-crm.component';

describe('PagerCrmComponent', () => {
  let component: PagerCrmComponent;
  let fixture: ComponentFixture<PagerCrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagerCrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagerCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
