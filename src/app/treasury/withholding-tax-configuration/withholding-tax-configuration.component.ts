import { Component, OnInit } from '@angular/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../constant/shared/shared.constant';
import { Filter, Operation, PredicateFormat } from '../../shared/utils/predicate';
import { State } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../shared/utils/column-settings.interface';
import { GridSettings } from '../../shared/utils/grid-settings.interface';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { isNumericWithPrecision, unique, ValidationService } from '../../shared/services/validation/validation.service';
import { SwalWarring } from '../../shared/components/swal/swal-popup';
import { WithholdingTaxConstant } from '../../constant/payment/withholding_tax_constant';
import { WithholdingTaxService } from '../../shared/services/withholding-tax/withholding-tax.service';
import { NumberConstant } from '../../constant/utility/number.constant';
import { Router } from '@angular/router';
import { TreasuryConstant } from '../../constant/treasury/treasury.constant';
import { TranslateService } from '@ngx-translate/core';
import { PermissionConstant } from '../../Structure/permission-constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { WithHoldingTaxTypeEnumerator } from '../../models/enumerators/withHoldingTax-type.enum';

@Component({
  selector: 'app-withholding-tax-configuration',
  templateUrl: './withholding-tax-configuration.component.html',
  styleUrls: ['./withholding-tax-configuration.component.scss']
})
export class WithholdingTaxConfigurationComponent implements OnInit {

  // withholding tax form
  withholdingTaxFormGroup: FormGroup;
  // Edited Row index
  private editedRowIndex: number;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public hasAddWithholdingTaxPermission: boolean;
  public hasDeleteWithholdingTaxPermission: boolean;
  public hasShowWithholdingTaxPermission: boolean;
  public hasUpdateWithholdingTaxPermission: boolean;
  public withholdingTaxTypeEnumerator= WithHoldingTaxTypeEnumerator;

  /**
   * Grid state
   */
  public gridState: State = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: WithholdingTaxConstant.DESIGNATION,
      title: WithholdingTaxConstant.DESIGNATION_TITLE,
      filterable: false
    },
    {
      field: WithholdingTaxConstant.PERCENTAGE,
      title: WithholdingTaxConstant.PERCENTAGE_TITLE,
      filterable: false
    },
    {
      field: WithholdingTaxConstant.TYPE,
      title: WithholdingTaxConstant.TYPE_TITLE,
      filterable: false
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  withholdingtax : string;
  constructor(public withholdingTaxService: WithholdingTaxService, private router: Router,
    private authService: AuthService,
    private fb: FormBuilder, private validationService: ValidationService, private swalWarrings: SwalWarring,
    private translate: TranslateService) { }

  initGridDataSource() {
    this.withholdingTaxService.processDataServerSide(this.predicate).subscribe(data => {
      this.gridSettings.gridData = data;
    });
  }
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.preparePredicate();
    this.initGridDataSource();

  }

  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.pageSize = this.gridSettings.state.take;
    this.predicate.page = (this.gridSettings.state.skip / this.gridSettings.state.take) + 1;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.withholdingTaxFormGroup = this.fb.group({
      Id: [dataItem.Id, Validators.required],
      Designation: [dataItem.Designation, {validators: [Validators.required, Validators.maxLength(250)],
        asyncValidators: unique(WithholdingTaxConstant.DESIGNATION, this.withholdingTaxService, dataItem.Id), updateOn: 'blur'}],
      Percentage: [dataItem.Percentage, [Validators.required,  Validators.min(0), Validators.max(100),
        Validators.maxLength(10), isNumericWithPrecision()]]
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.withholdingTaxFormGroup);

  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {
        this.withholdingTaxService.save(formGroup.value, isNew, this.predicate).subscribe(() => {
        this.preparePredicate();
        this.initGridDataSource()
        });
        sender.closeRow(rowIndex);
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
  * Remove handler
  * @param param0
  */
  public removeHandler(dataItem) {
    var text = `${this.translate.instant('DELETE_WITHHOLDING_TAX_MSG')}`;
    this.swalWarrings.CreateSwal(text).then((result) => {
      if (result.value) {
        this.withholdingTaxService.remove(dataItem).subscribe(() => {
          this.preparePredicate();
          this.initGridDataSource();
        });
      }
    });
  }

  /**
  * Close editor
  * @param grid
  * @param rowIndex
  */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.withholdingTaxFormGroup = undefined;
    }
  }

  /**
  * Quick add
  * @param param0
  */
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.withholdingTaxFormGroup = new FormGroup({
      Designation: new FormControl('', {validators: [Validators.required, Validators.maxLength(250)],
        asyncValidators: unique(WithholdingTaxConstant.DESIGNATION, this.withholdingTaxService, String(NumberConstant.ZERO)),
        updateOn: 'blur'}),
      Percentage: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100),
        Validators.maxLength(10), isNumericWithPrecision()])
    });
    sender.addRow(this.withholdingTaxFormGroup);
  }

  public goToAdvancedEdit(dataItem) {
      this.router.navigateByUrl(TreasuryConstant.WITH_HOLDING_TAX_EDIT.concat(dataItem.Id));
  }

  ngOnInit() {
    this.hasAddWithholdingTaxPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsTreasuryPermissions.ADD_WITHHOLDING_TAX_TREASURY);
    this.hasDeleteWithholdingTaxPermission =
     this.authService.hasAuthority(PermissionConstant.SettingsTreasuryPermissions.DELETE_WITHHOLDING_TAX_TREASURY);
    this.hasShowWithholdingTaxPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsTreasuryPermissions.SHOW_WITHHOLDING_TAX_TREASURY);
    this.hasUpdateWithholdingTaxPermission =
    this.authService.hasAuthority(PermissionConstant.SettingsTreasuryPermissions.UPDATE_WITHHOLDING_TAX_TREASURY);
    this.preparePredicate();
    this.initGridDataSource();
  }
  filter(){
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(WithholdingTaxConstant.DESIGNATION, Operation.contains, this.withholdingtax, false, true));
    this.predicate.Filter.push(new Filter(WithholdingTaxConstant.PERCENTAGE, Operation.contains, this.withholdingtax, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
}
