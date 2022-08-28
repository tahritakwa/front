import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SharedModalStarkdriveComponent} from './shared-modal-starkdrive.component';

describe('SharedModalStarkdriveComponent', () => {
  let component: SharedModalStarkdriveComponent;
  let fixture: ComponentFixture<SharedModalStarkdriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SharedModalStarkdriveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedModalStarkdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
