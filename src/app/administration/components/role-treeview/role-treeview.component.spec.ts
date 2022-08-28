import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleTreeviewComponent } from './role-treeview.component';

describe('RoleTreeviewComponent', () => {
    let component: RoleTreeviewComponent;
    let fixture: ComponentFixture<RoleTreeviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoleTreeviewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoleTreeviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
