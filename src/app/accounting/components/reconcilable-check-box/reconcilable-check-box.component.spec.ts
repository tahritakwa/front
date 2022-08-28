import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconcilableCheckBoxComponent } from './reconcilable-check-box.component';

describe('ReconcilableCheckBoxComponent', () => {
  let component: ReconcilableCheckBoxComponent;
  let fixture: ComponentFixture<ReconcilableCheckBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconcilableCheckBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconcilableCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
