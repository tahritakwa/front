import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownFooterComponent } from './drop-down-footer.component';

describe('DropDownFooterComponent', () => {
  let component: DropDownFooterComponent;
  let fixture: ComponentFixture<DropDownFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropDownFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
