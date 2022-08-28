import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsModalStarkdriveComponent} from './details-modal-starkdrive.component';

describe('DetailsModalStarkdriveComponent', () => {
  let component: DetailsModalStarkdriveComponent;
  let fixture: ComponentFixture<DetailsModalStarkdriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsModalStarkdriveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsModalStarkdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
