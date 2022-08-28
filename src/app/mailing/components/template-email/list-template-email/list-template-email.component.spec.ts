import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTemplateEmailComponent } from './list-template-email.component';

describe('ListTemplateEmailComponent', () => {
  let component: ListTemplateEmailComponent;
  let fixture: ComponentFixture<ListTemplateEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTemplateEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTemplateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
