import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionOperationEditorComponent } from './intervention-operation-editor.component';

describe('InterventionOperationEditorComponent', () => {
  let component: InterventionOperationEditorComponent;
  let fixture: ComponentFixture<InterventionOperationEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionOperationEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionOperationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
