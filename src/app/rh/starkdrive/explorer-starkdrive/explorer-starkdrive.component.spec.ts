import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExplorerStarkdriveComponent} from './explorer-starkdrive.component';

describe('ExplorerStarkdriveComponent', () => {
  let component: ExplorerStarkdriveComponent;
  let fixture: ComponentFixture<ExplorerStarkdriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExplorerStarkdriveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerStarkdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
