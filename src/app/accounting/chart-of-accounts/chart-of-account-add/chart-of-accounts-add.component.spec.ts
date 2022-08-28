import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartOfAccountAddComponent } from './chart-of-accounts-add.component';


describe('ChartOfAccountAddComponent', () => {
  let component: ChartOfAccountAddComponent;
  let fixture: ComponentFixture<ChartOfAccountAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOfAccountAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOfAccountAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
