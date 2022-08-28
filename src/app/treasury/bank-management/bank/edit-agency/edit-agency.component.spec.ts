import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EditAgencyComponent } from "./edit-agency.component";

describe('EditAgencyComponent', () => {
    let component: EditAgencyComponent;
    let fixture: ComponentFixture<EditAgencyComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ EditAgencyComponent ]
        })
        .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(EditAgencyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });
});