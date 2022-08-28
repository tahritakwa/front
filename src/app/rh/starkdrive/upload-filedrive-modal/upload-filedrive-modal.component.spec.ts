import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadFiledriveModalComponent} from './upload-filedrive-modal.component';

describe('UploadFiledriveModalComponent', () => {
  let component: UploadFiledriveModalComponent;
  let fixture: ComponentFixture<UploadFiledriveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFiledriveModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFiledriveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
