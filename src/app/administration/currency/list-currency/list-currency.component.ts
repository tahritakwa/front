import {Component, ComponentRef, OnInit} from '@angular/core';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {Filter, Operation, PredicateFormat} from '../../../shared/utils/predicate';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {Router} from '@angular/router';
import {CurrencyService} from '../../services/currency/currency.service';
import {isEqualLength, unique, ValidationService} from '../../../shared/services/validation/validation.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {Currency} from '../../../models/administration/currency.model';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

const ACTIVE_EDIT_URL = 'main/settings/administration/currency/AdvancedEdit/';

@Component({
  selector: 'app-list-currency',
  templateUrl: './list-currency.component.html',
  styleUrls: ['./list-currency.component.scss']
})
export class ListCurrencyComponent implements OnInit {

  dialogOptions: Partial<IModalDialogOptions<any>>;

  isAdvancedAdd = false;
  dataItemUpdated = false;
  public currencyToEdit;
  // Edited Row index
  private editedRowIndex: number;
  // Grid quick add
  public currencyFormGroup: FormGroup;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  /**
   * button Advanced Edit visibility
   */
  private btnEditVisible: boolean;
  public isModal = false;
  public currency;
  public hasShowCurrencyPermission: boolean;
  public hasUpdateCurrencyPermission: boolean;

  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
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
      field: 'Code',
      title: 'CODE',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    },
    {
      field: 'Symbole',
      title: 'SYMBOLE',
      filterable: true,
      _width: NumberConstant.ONE_HUNDRED_FIFTY

    },
    {
      field: 'CurrencyInLetter',
      title: 'CURRENCY_IN_LETTER',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED

    },
    {
      field: 'Description',
      title: 'DESCRIPTION',
      filterable: true,
      _width: NumberConstant.TWO_HUNDRED
    }
  ];

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(public currencyService: CurrencyService, private router: Router, private translate: TranslateService,
    private authService: AuthService,
    private validationService: ValidationService, private swalWarrings: SwalWarring, private fb: FormBuilder) {
    this.btnEditVisible = true;
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.currencyService.reloadServerSideData(state, this.predicate).subscribe(data => this.gridSettings.gridData = data);

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
      this.currencyFormGroup = undefined;
    }
    this.btnEditVisible = true;
  }

  /**
   * Quick add
   * @param param0
   */
  public addHandler({sender}) {
    this.closeEditor(sender);
    this.currencyFormGroup = new FormGroup({
      Code: new FormControl('', {
        validators: [Validators.required, isEqualLength(NumberConstant.THREE)],
        asyncValidators: unique(SharedConstant.CODE, this.currencyService, String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }),
      Description: new FormControl('', Validators.required),
      Symbole: new FormControl('', Validators.required),
      CurrencyInLetter: new FormControl('', Validators.required)
    });

    sender.addRow(this.currencyFormGroup);
    this.btnEditVisible = false;

  }

  /**
   * Quick edit
   * @param param0
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);

    this.currencyFormGroup = this.fb.group({
      Id: [dataItem.Id, Validators.required],
      Code: new FormControl(dataItem.Code, {
        validators: [Validators.required, isEqualLength(NumberConstant.THREE)],
        asyncValidators: unique(SharedConstant.CODE, this.currencyService, String(NumberConstant.ZERO)),
        updateOn: 'blur'
      }),
      Description: [dataItem.Description, Validators.required],
      Symbole: [dataItem.Symbole, Validators.required],
      CurrencyInLetter: [dataItem.CurrencyInLetter, Validators.required],
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.currencyFormGroup);
    this.btnEditVisible = false;
  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const item: Currency = formGroup.value;
      if (item.Id != null) {
        this.currencyService.getById(item.Id).subscribe(data => {
          item.FloatInLetter = data.FloatInLetter;
          item.Precision = data.Precision;
          this.currencyService.save(item, isNew, this.predicate).subscribe(() => this.initGridDataSource());
        });
      } else {
        this.currencyService.save(item, isNew, this.predicate).subscribe(() => this.initGridDataSource());
      }


      sender.closeRow(rowIndex);
      this.btnEditVisible = true;

    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.currencyService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ACTIVE_EDIT_URL.concat(dataItem.Id));
  }

  public filter() {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(SharedConstant.CODE, Operation.contains, this.currency, false, true));
    this.predicate.Filter.push(new Filter('Symbole', Operation.contains, this.currency, false, true));
    this.predicate.Filter.push(new Filter('CurrencyInLetter', Operation.contains, this.currency, false, true));
    this.predicate.Filter.push(new Filter('Description', Operation.contains, this.currency, false, true));
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  ngOnInit() {
    this.hasShowCurrencyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_CURRENCY);
    this.hasUpdateCurrencyPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_CURRENCY);
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.currencyService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }
}
