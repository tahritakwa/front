import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {QualificationType} from '../../../models/payroll/qualification-type.model';
import {DropDownComponent} from '../../../shared/interfaces/drop-down-component.interface';
import {QualificationTypeService} from '../../services/qualification-type/qualification-type.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {ListQualificationTypeComponent} from '../../../payroll/qualification-type/list-qualification-type/list-qualification-type.component';
import {QualificationConstant} from '../../../constant/payroll/qualification.constant';
import {PermissionConstant} from '../../../Structure/permission-constant';
import {OrderBy, OrderByDirection, PredicateFormat} from '../../utils/predicate';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-qualification-type-dropdown',
  templateUrl: './qualification-type-dropdown.component.html',
  styleUrls: ['./qualification-type-dropdown.component.scss']
})
export class QualificationTypeDropdownComponent implements OnInit, DropDownComponent {
  @Input() group;
  @Input() allowCustom;
  @Input() disabled;
  public qualificationTypeDataSource: QualificationType[];
  public qualificationTypeFiltredDataSource: QualificationType[];
  public hasAddPermission: boolean;
  private predicate: PredicateFormat;


  constructor(private qualificationTypeService: QualificationTypeService,
              private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef, private authService: AuthService) {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_QUALIFICATIONTYPE);
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.preparePredicate();
    this.qualificationTypeService.listdropdownWithPerdicate(this.predicate).toPromise().then((data: any) => {
      this.qualificationTypeDataSource = data.listData;
      this.qualificationTypeFiltredDataSource = this.qualificationTypeDataSource.slice(0);
    });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.qualificationTypeFiltredDataSource = this.qualificationTypeDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  addNew(): void {
    this.formModalDialogService.openDialog(QualificationConstant.ADD_QUALIFICATION_TYPE, ListQualificationTypeComponent,
      this.viewRef, this.initDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }
}
