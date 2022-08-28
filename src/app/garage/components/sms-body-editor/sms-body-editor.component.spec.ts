import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsBodyEditorComponent } from './sms-body-editor.component';

describe('SmsBodyEditorComponent', () => {
  let component: SmsBodyEditorComponent;
  let fixture: ComponentFixture<SmsBodyEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsBodyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsBodyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
