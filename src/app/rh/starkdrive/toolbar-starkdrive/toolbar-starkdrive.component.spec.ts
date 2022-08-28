import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ToolbarStarkdriveComponent} from './toolbar-starkdrive.component';

describe('ToolbarStarkdriveComponent', () => {
  let component: ToolbarStarkdriveComponent;
  let fixture: ComponentFixture<ToolbarStarkdriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarStarkdriveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarStarkdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
