import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IModalDialogOptions } from 'ngx-modal-dialog';
import { CategoryService } from '../../../immobilization/services/category/category.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { ImmobilizationType } from '../../../models/enumerators/immobilization-type.enum';
import { AccountingConfigurationService } from '../../services/configuration/accounting-configuration.service';
import { AccountingConfigurationConstant } from '../../../constant/accounting/accounting-configuration.constant';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { Observable } from 'rxjs/Observable';
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { AccountService } from '../../services/account/account.service';
import { ActivatedRoute } from '@angular/router';
import { NumberConstant } from '../../../constant/utility/number.constant';
import {StarkRolesService} from '../../../stark-permissions/service/roles.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

@Component({
  selector: 'app-list-amortization-configuration',
  templateUrl: './list-amortization-configuration.component.html',
  styleUrls: ['./list-amortization-configuration.component.scss']
})
export class ListAmortizationConfigurationComponent implements OnInit {

  public categoryFormGroup: FormGroup;
  private editedRowIndex: number;
  public optionDialog: Partial<IModalDialogOptions<any>>;
  public editMode = false;
  public isSave = false;
  public styleDeprectionPeriod = true;
  public immobilizationAccountList: any[];
  public amortizationAccountList: any[];
  public intangibleImmobilizationAccountList: any[];
  public intangibleAmortizationAccountList: any[];
  public min = 1;
  public accounts = this.route.snapshot.data['accounts'];

  @ViewChild(GridComponent) grid;

  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 20,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  spinner = false;
  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Code',
      title: 'CODE',
      tooltip: 'CODE',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: 'Label',
      title: 'LABEL',
      tooltip:'LABEL',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY
    },
    {
      field: 'ImmobilisationTypeText',
      title: 'TYPE',
      tooltip:'TYPE',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED
    },
    {
      field: 'DepreciationPeriod',
      title: 'DURATION',
      tooltip:'DURATION',
      filterable: true,
      filter: 'numeric',
      _width: NumberConstant.ONE_HUNDRED_TWENTY
    },
    {
      field: 'ImmobilizationAccount',
      title: 'DEPRECIATION_ACCOUNT',
      tooltip:'DEPRECIATION_ACCOUNT',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    },
    {
      field: 'AmortizationAccount',
      title: 'AMORTIZATION_ACCOUNT',
      tooltip:'AMORTIZATION_ACCOUNT',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED_FIFTY
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public AccountingPermissions = PermissionConstant.SettingsAccountingPermissions;
  selectedRows: number[] = [];
  constructor(private categoryService: CategoryService, private validationService: ValidationService,
    private growlService: GrowlService, private accountingConfigurationService: AccountingConfigurationService,
    private translate: TranslateService, private genericAccountingService: GenericAccountingService,
    private route: ActivatedRoute, private authService: AuthService) {
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  initGridDataSource() {
    forkJoin(this.categoryService.reloadServerSideData(this.gridSettings.state),
      this.accountingConfigurationService.getJavaGenericService()
        .getData(AccountingConfigurationConstant.DEPRECIATION_ASSETS_CONFIGURATION_URL))
      .subscribe(result => {
        result[0].data.forEach(obj => {
          obj.ImmobilisationTypeText = ImmobilizationType[obj.ImmobilisationType];
        });
        result[1].forEach(amortizationCategory => {
          const categorie = result[0].data.find(category => category.Id === amortizationCategory.idCategory);
          if(categorie != undefined) {
            categorie.DepreciationPeriod = amortizationCategory.depreciationPeriod;
            categorie.ImmobilizationAccount = amortizationCategory.immobilizationAccount;
            categorie.AmortizationAccount = amortizationCategory.amortizationAccount;
          }
        });

        result[0].data.forEach(category => {
          if (category.DepreciationPeriod === undefined) {
            this.selectedRows.push(category.Id);
          }
        });
        this.gridSettings.gridData = result[0];
      });
  }

    editRowByIdCategory() {
      if(!this.immobilizationAccountList  || !this.amortizationAccountList) {
        this.initAccountList();
      }
      const idCategory = this.route.snapshot.paramMap.get('idCategory');
      if (idCategory !== null && idCategory !== undefined) {
        const indexEdit = this.gridSettings.gridData.data.findIndex(line => line.Id === Number(idCategory));
        const dataItemToEdit = this.gridSettings.gridData.data.find(line => line.Id === Number(idCategory));
        this.categoryFormGroup.markAsTouched();
        this.grid.editRow(indexEdit, this.categoryFormGroup);
        this.categoryFormGroup.patchValue(dataItemToEdit);
        this.editMode = true;
        this.editedRowIndex = indexEdit;
        this.changeListAccountsByCategoryType(dataItemToEdit);
      }
    }

  public saveHandler({ sender, rowIndex, formGroup }) {
    let idCategory ;
    if (this.categoryFormGroup.valid) {
      const item: any = this.categoryFormGroup.value;
      item.idCategory = item.Id;
      idCategory = item.Id;
      item.depreciationPeriod = item.DepreciationPeriod;
      item.immobilizationAccount = item.ImmobilizationAccount.id ? item.ImmobilizationAccount.id : item.ImmobilizationAccount;
      item.amortizationAccount = item.AmortizationAccount.id ? item.AmortizationAccount.id : item.AmortizationAccount;
      item.immobilisationTypeText = item.ImmobilisationTypeText;
      delete item.DepreciationPeriod;
      this.selectedRows.pop();
      this.accountingConfigurationService.getJavaGenericService()
        .sendData(AccountingConfigurationConstant.DEPRECIATION_ASSETS_CONFIGURATION_URL, item)
        .subscribe(() => {
          this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
          const category = this.gridSettings.gridData.data.find(categoryItem => this.gridSettings.gridData.data.indexOf(categoryItem) === rowIndex);
          if(category != undefined) {
          category.DepreciationPeriod = item.depreciationPeriod;
          category.ImmobilizationAccount = this.immobilizationAccountList.find(immobilizationAccount => immobilizationAccount.id === item.immobilizationAccount);
          category.AmortizationAccount = this.amortizationAccountList.find(amortizationAccount => amortizationAccount.id === item.amortizationAccount);
          }
          if (category.ImmobilizationAccount === undefined) {
            category.ImmobilizationAccount = item.ImmobilizationAccount;
          }
          if (category.AmortizationAccount === undefined) {
            category.AmortizationAccount = item.AmortizationAccount;
          }
          this.gridSettings.gridData.data.forEach(categoryItem => {
            if (categoryItem.DepreciationPeriod === undefined) {
              this.selectedRows.push(categoryItem.Id);
            }
          });
        });
      this.closeEditor(sender, rowIndex);
    } else {
      this.validationService.validateAllFormFields(this.categoryFormGroup);
    }
    if (idCategory !== null && idCategory !== undefined) {
      this.saveDepreciationAssests(idCategory);
    }
    this.isSave = true;
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.categoryFormGroup = this.initCategoryFormGroup();
  }

  public saveDepreciationAssests(idCategory) {
    this.spinner = true;
    this.accountingConfigurationService.getJavaGenericService().
    sendData(`${AccountingConfigurationConstant.DEPRECIATION_ASSETS_CONFIGURATION_URL}/${idCategory}`).subscribe(result => {
    }, () => {}, () => {
      this.spinner = false;
    });
  }
  initCategoryFormGroup() {
    return new FormGroup({
      Id: new FormControl(''),
      Code: new FormControl({ value: '', disabled: true }, Validators.required),
      Label: new FormControl({ value: '', disabled: true }, Validators.required),
      ImmobilisationType: new FormControl({ value: '', disabled: true }, Validators.required),
      DepreciationPeriod: new FormControl({ value: '', disabled: false }, Validators.required),
      ImmobilizationAccount: new FormControl({ value: '', disabled: false }, Validators.required),
      AmortizationAccount: new FormControl({ value: '', disabled: false }, Validators.required),
      ImmobilisationTypeText: new FormControl({ value: '', disabled: false }, Validators.required),
    });
  }

  public lineClickHandler({ sender, rowIndex, dataItem }) {
    if(this.authService.hasAuthority(this.AccountingPermissions.AMORTIZATION_OF_IMMOBILIZATIONS_SETTINGS)){
      if (!this.isSave) {
        this.handleEditHandler(sender, rowIndex, dataItem);
      } else {
        this.isSave = false;
      }
    }
  }

  editHandler(sender: GridComponent, rowIndex: number) {
    this.categoryFormGroup.markAsTouched();
    sender.editRow(rowIndex, this.categoryFormGroup);
    this.editMode = true;
  }

  public handleEditHandler(sender: GridComponent, rowIndex: number, dataItem: any) {
    if (this.editedRowIndex === undefined) {
      this.editHandler(sender, rowIndex);
      this.categoryFormGroup.patchValue(dataItem);
      this.editedRowIndex = rowIndex;
      this.changeListAccountsByCategoryType(dataItem);
    }
  }

  public changeListAccountsByCategoryType(dataItem) {
    if (dataItem.ImmobilisationTypeText === this.translate.instant(SharedAccountingConstant.INTANGIBLE)) {
      this.immobilizationAccountList = this.accounts.intangibleImmobilizationAccounts;
      this.amortizationAccountList = this.accounts.intangibleAmortizationAccounts;
    } else {
      this.immobilizationAccountList = this.accounts.tangibleImmobilizationAccounts;
      this.amortizationAccountList = this.accounts.tangibleAmortizationAccounts;
    }
  }
  public keyEnterAction(sender: GridComponent, formGroup: any, e: KeyboardEvent) {
    const rowIndex = this.editedRowIndex;
    if (!formGroup || !formGroup.valid || e.key !== KeyboardConst.ENTER) {
      return;
    }
    this.saveHandler({ sender, rowIndex, formGroup });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.genericAccountingService.handleCanDeactivateToLeaveCurrentComponent(this.isAmortizationConfigurationFormChanged.bind(this));
  }

  public isAmortizationConfigurationFormChanged(): boolean {
    return this.categoryFormGroup.touched;
  }

  initAccountList() {
      this.immobilizationAccountList = this.accounts.tangibleImmobilizationAccounts;
      this.amortizationAccountList = this.accounts.tangibleAmortizationAccounts;
  }

  ngOnInit() {
    this.categoryFormGroup = this.initCategoryFormGroup();
    this.initAccountList();
    this.initGridDataSource();
  }
}
