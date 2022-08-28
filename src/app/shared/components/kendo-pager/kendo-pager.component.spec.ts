import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KendoPagerComponent } from './kendo-pager.component';

describe('KendoPagerComponent', () => {
  let component: KendoPagerComponent;
  let fixture: ComponentFixture<KendoPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KendoPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KendoPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
