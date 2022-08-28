import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GerestockComponent } from './gerestock.component';

describe('GerestockComponent', () => {
  let component: GerestockComponent;
  let fixture: ComponentFixture<GerestockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerestockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
