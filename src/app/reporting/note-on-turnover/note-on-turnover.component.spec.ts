import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteOnTurnoverComponent } from './note-on-turnover.component';


describe('NoteOnTurnoverComponent', () => {
  let component: NoteOnTurnoverComponent;
  let fixture: ComponentFixture<NoteOnTurnoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteOnTurnoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteOnTurnoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});