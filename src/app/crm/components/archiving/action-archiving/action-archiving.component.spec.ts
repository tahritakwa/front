import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionArchivingComponent } from './action-archiving.component';

describe('ActionArchivingComponent', () => {
  let component: ActionArchivingComponent;
  let fixture: ComponentFixture<ActionArchivingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionArchivingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionArchivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
