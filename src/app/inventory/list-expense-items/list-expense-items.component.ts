import {Component, ComponentRef, OnInit} from '@angular/core';
import {ItemConstant} from '../../constant/inventory/item.constant';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ValidationService} from '../../shared/services/validation/validation.service';
import {Filter, Operation, Operator, PredicateFormat, Relation} from '../../shared/utils/predicate';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {Router} from '@angular/router';
import {ItemService} from '../services/item/item.service';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {ExpenseConstant} from '../../constant/purchase/expense.contant';
import {ExpenseService} from '../../purchase/services/expense/expense.service';
import { NumberConstant } from '../../constant/utility/number.constant';
import { AuthService } from '../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../Structure/permission-constant';

@Component({
  selector: 'app-list-expense-items',
  templateUrl: './list-expense-items.component.html',
  styleUrls: ['./list-expense-items.component.scss']
})
export class ListExpenseItemsComponent implements OnInit {

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public actionColumnWidth = SharedConstant.COLUMN_ACTIONS_WIDTH;

  public predicate: PredicateFormat;
  private expenseItemList = {
    data: [],
    total: 0
  };
  dialogOptions: Partial<IModalDialogOptions<any>>;
  private btnEditVisible: boolean;
  searchValue:string;
  public hasAddExpenseItemPermission: boolean;
  public hasUpdateExpenseItemPermission: boolean;
  public hasDeleteExpenseItemPermission: boolean;
  public hasShowExpenseItemPermission: boolean;

  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: ExpenseConstant.CODE,
      title: ExpenseConstant.CODE_UPPERCASE,
      filterable: false,
      _width: 200
    },
    {
      field: ExpenseConstant.DESCRIPTION,
      title: ExpenseConstant.DESCRIPTION_UPPERCASE,
      filterable: false,
      _width: 240
    },
    {
      field: ExpenseConstant.NAME_FROM_ID_TAXE_NAVIGATION,
      title: ExpenseConstant.TVA,
      filterable: false,
      _width: 160
    },
    {
      field: ExpenseConstant.NAME_TIERS,
      title: ExpenseConstant.RECIPIENT_UPPERCASE,
      filterable: false,
      _width: 200
    },
    {
      field: ExpenseConstant.CODE_FROM_ID_CURRENCY_NAVIGATION,
      title: ExpenseConstant.CURRENCY_UPPERCASE,
      filterable: false,
      _width: 160
    }
  ];

  //excel columns config
  public excelColumnsConfig: ColumnSettings[] = [
    {
      field: ExpenseConstant.CODE,
      title: ExpenseConstant.CODE_UPPERCASE,
      filterable: false,
      _width: 200
    },
    {
      field: ExpenseConstant.DESCRIPTION,
      title: ExpenseConstant.DESCRIPTION_UPPERCASE,
      filterable: false,
      _width: 240
    },
    {
      field: ExpenseConstant.NAME_FROM_ID_TAXE_NAVIGATION,
      title: ExpenseConstant.TVA,
      filterable: false,
      _width: 160
    },
    {
      field:'TiersNamesString',
      title: ExpenseConstant.RECIPIENT_UPPERCASE,
      filterable: false,
      _width: 200
    },
  ];
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
   //excel grid settings
   public excelGridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.excelColumnsConfig
  };

  constructor(private itemService: ItemService, public expenseService: ExpenseService,
              private fb: FormBuilder, private validationService: ValidationService,
              private authService: AuthService,
              private swalWarrings: SwalWarring, private router: Router) {
    this.btnEditVisible = true;
  }

  ngOnInit() {
    this.hasAddExpenseItemPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_EXPENSE);
    this.hasUpdateExpenseItemPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_EXPENSE);
    this.hasDeleteExpenseItemPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.DELETE_EXPENSE);
    this.hasShowExpenseItemPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.SHOW_EXPENSE);
    this.preparePredicate();
    this.initGridDataSource();
  }

  /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.preparePredicate();
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  /**
   * Prepare Predicate
   */
  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    if(this.searchValue != ""){
    this.predicate.Operator = Operator.or;
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(ItemConstant.DESCRIPTION, Operation.contains, this.searchValue, false, true));
    this.predicate.Filter.push(new Filter(ItemConstant.CODE, Operation.contains, this.searchValue, false, true));
  }
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(ExpenseConstant.ID_CURRENCY_NAVIGATION),
        new Relation(ExpenseConstant.ID_TAXE_NAVIGATION),
        new Relation(ExpenseConstant.ID_ITEM_NAVIGATION),
        new Relation(ExpenseConstant.ID_TIERS_NAVIGATION_FROM_ID_ITEM_NAVIGATION)]);
    this.predicate.SpecificRelation = new Array<string>();
    this.predicate.SpecificRelation.push('IdItemNavigation.ItemTiers.IdTiersNavigation');
  }

  initGridDataSource() {
    this.expenseItemList = {
      data: [],
      total: 0
    };
    this.expenseService.reloadServerSideDataWithListPredicate(this.gridSettings.state, [this.predicate],
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  /**
   * Remove handler
   * @param param0
   */
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(ExpenseConstant.EXPENSE_DELETE_TEXT_MESSAGE,
      ExpenseConstant.EXPENSE_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.expenseService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(ItemConstant.EXPENSES_ADVANCED_EDIT.concat(dataItem.Id), {skipLocationChange: true});
  }

  receiveData(event: any) {
    this.searchValue =  event.searchValue;
    this.preparePredicate();
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

}
