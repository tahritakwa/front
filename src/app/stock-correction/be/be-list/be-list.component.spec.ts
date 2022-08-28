import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeListComponent } from './be-list.component';

describe('BeListComponent', () => {
  let component: BeListComponent;
  let fixture: ComponentFixture<BeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
