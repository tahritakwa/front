import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgTtfComponent } from './avg-ttf.component';

describe('AvgTtfComponent', () => {
  let component: AvgTtfComponent;
  let fixture: ComponentFixture<AvgTtfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgTtfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgTtfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
