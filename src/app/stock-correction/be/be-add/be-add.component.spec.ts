import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeAddComponent } from './be-add.component';

describe('BeAddComponent', () => {
  let component: BeAddComponent;
  let fixture: ComponentFixture<BeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
