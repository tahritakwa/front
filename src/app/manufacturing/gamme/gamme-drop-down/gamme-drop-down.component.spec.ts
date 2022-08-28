import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GammeDropDownComponent } from './gamme-drop-down.component';

describe('GammeDropDownComponent', () => {
  let component: GammeDropDownComponent;
  let fixture: ComponentFixture<GammeDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GammeDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GammeDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
