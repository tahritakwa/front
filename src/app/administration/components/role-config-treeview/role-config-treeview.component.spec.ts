import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleConfigTreeviewComponent } from './role-config-treeview.component';

describe('RoleConfigTreeviewComponent', () => {
    let component: RoleConfigTreeviewComponent;
    let fixture: ComponentFixture<RoleConfigTreeviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoleConfigTreeviewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoleConfigTreeviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
