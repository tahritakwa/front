import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FileExplorerStarkdriveComponent} from './file-explorer-starkdrive.component';

describe('FileExplorerStarkdriveComponent', () => {
  let component: FileExplorerStarkdriveComponent;
  let fixture: ComponentFixture<FileExplorerStarkdriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileExplorerStarkdriveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileExplorerStarkdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
