import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {GradeService} from '../../../payroll/services/grade/grade.service';
import {DropDownComponent} from '../../interfaces/drop-down-component.interface';
import {ReducedGrade} from '../../../models/payroll/reduced-grade.model';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ListGradeComponent} from '../../../payroll/grade/list-grade/list-grade.component';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {GradeConstant} from '../../../constant/payroll/grade.constant';
import {OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-grade-dropdown',
  templateUrl: './grade-dropdown.component.html',
  styleUrls: ['./grade-dropdown.component.scss']
})
export class GradeDropdownComponent implements OnInit, DropDownComponent {
  @Input() group;
  @Input() allowCustom;
  public gradeDataSource: ReducedGrade[];
  public gradeFiltredDataSource: ReducedGrade[];
  public predicate: PredicateFormat;
 public hasAddPermission: boolean;

  constructor(private gradeService: GradeService, private authService: AuthService,
              private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef) {
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_GRADE);
    this.initDataSource();
  }

  initDataSource(): void {
    this.preparePredicate();
    this.gradeService.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.gradeDataSource = data.listData;
      this.gradeFiltredDataSource = this.gradeDataSource.slice(0);
    });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(GradeConstant.DESIGNATION, OrderByDirection.asc));
  }

  /**
   * filter by designaton
   * @param value
   */
  handleFilter(value: string): void {
    this.gradeFiltredDataSource = this.gradeDataSource.filter((s) =>
      s.Designation.toLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    this.formModalDialogService.openDialog(GradeConstant.ADD_GRADE, ListGradeComponent,
      this.viewRef, this.initDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_CLASS_S);
  }
}
