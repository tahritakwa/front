import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiersContactComponent } from './tiers-contact.component';

describe('TiersContactComponent', () => {
  let component: TiersContactComponent;
  let fixture: ComponentFixture<TiersContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiersContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiersContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
