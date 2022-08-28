import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubModelsComponent } from './list-sub-models.component';

describe('ListSubModelsComponent', () => {
  let component: ListSubModelsComponent;
  let fixture: ComponentFixture<ListSubModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
