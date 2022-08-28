import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddFileComponent } from './popup-add-file.component';

describe('PopupAddFileComponent', () => {
  let component: PopupAddFileComponent;
  let fixture: ComponentFixture<PopupAddFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupAddFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupAddFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
