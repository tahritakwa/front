import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkerDropdownComponent } from './worker-dropdown.component';


describe('WorkerDropdownComponent', () => {
  let component: WorkerDropdownComponent;
  let fixture: ComponentFixture<WorkerDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
