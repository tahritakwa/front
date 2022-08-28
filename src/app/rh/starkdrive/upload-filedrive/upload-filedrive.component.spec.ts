import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadFiledriveComponent} from './upload-filedrive.component';

describe('UploadFiledriveComponent', () => {
  let component: UploadFiledriveComponent;
  let fixture: ComponentFixture<UploadFiledriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFiledriveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFiledriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
