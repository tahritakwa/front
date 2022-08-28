import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FolderModalStarkdriveComponent} from './folder-modal-starkdrive.component';


describe('FolderModalStarkdriveComponent', () => {
  let component: FolderModalStarkdriveComponent;
  let fixture: ComponentFixture<FolderModalStarkdriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FolderModalStarkdriveComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderModalStarkdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
