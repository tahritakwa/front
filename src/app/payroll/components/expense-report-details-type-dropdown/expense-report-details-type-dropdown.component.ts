import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ExpenseReportDetailsTypeService} from '../../services/expense-report-details-type/expense-report-details-type.service';
import {ExpenseReportDetailsType} from '../../../models/payroll/expense-report-details-type.model';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {TranslationKeysConstant} from '../../../constant/shared/translation-keys.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {ExpenseReportDetailTypeComponent} from '../../expense-report-detail-type/expense-report-detail-type/expense-report-detail-type.component';
import {RoleConfigConstant} from '../../../Structure/_roleConfigConstant';
import {isNullOrUndefined} from 'util';
import {notEmptyValue} from '../../../stark-permissions/utils/utils';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import {OrderBy, OrderByDirection, PredicateFormat} from '../../../shared/utils/predicate';


@Component({
  selector: 'app-expense-report-details-type-dropdown',
  templateUrl: './expense-report-details-type-dropdown.component.html',
  styleUrls: ['./expense-report-details-type-dropdown.component.scss']
})
export class ExpenseReportDetailsTypeDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() allowCustom;

  // The data input of the combobox
  public expenseReportDetailsDataSource: ExpenseReportDetailsType[];
  public expenseReportDetailsFiltredData: ExpenseReportDetailsType[];
  public showAddButton = false;
  public predicate: PredicateFormat;


  constructor(private expenseReportDetails: ExpenseReportDetailsTypeService,
              private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
              private roleService: StarkRolesService) {
  }

  addNew(): void {
    this.formModalDialogService.openDialog(TranslationKeysConstant.ADD_EXPENSE_REPORT_DETAIL_TYPE, ExpenseReportDetailTypeComponent,
      this.viewRef, this.initDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  ngOnInit() {
    this.initDataSource();
    this.roleService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
      if (!isNullOrUndefined(roledata) && notEmptyValue(roledata)) {
        this.roleService.hasOnlyRoles([RoleConfigConstant.Resp_RhConfig, RoleConfigConstant.ManagerConfig]).then(y => {
          this.showAddButton = y;
        });
      }
    });

  }

  initDataSource(): void {
    this.preparePredicate();
    this.expenseReportDetails.listdropdownWithPerdicate(this.predicate).subscribe((data: any) => {
      this.expenseReportDetailsDataSource = data.listData;
      this.expenseReportDetailsFiltredData = this.expenseReportDetailsDataSource.slice(0);
    });
  }

  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }

  /**
   * filter by label
   * @param value
   */
  handleFilter(value: string): void {
    this.expenseReportDetailsFiltredData = this.expenseReportDetailsDataSource.filter((s) =>
      s.Label.toLowerCase().includes(value.toLowerCase()));
  }

}
