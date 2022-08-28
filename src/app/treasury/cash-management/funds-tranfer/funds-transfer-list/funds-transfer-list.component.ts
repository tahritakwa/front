import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { CompanyService } from '../../../../administration/services/company/company.service';
import { isNullOrUndefined } from 'util';
import { FieldTypeConstant } from '../../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { FundsTransferConstant } from '../../../../constant/treasury/funds-transfer.constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { Currency } from '../../../../models/administration/currency.model';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { FiltrePredicateModel } from '../../../../models/shared/filtrePredicate.model';
import { FundsTransferStateEnum } from '../../../../models/treasury/funds-transfer-state';
import { FundsTransferTypeEnum } from '../../../../models/treasury/funds-transfer-type';
import { SwalWarring } from '../../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../../shared/utils/grid-settings.interface';
import { Filter, Operation, PredicateFormat, Relation, SpecFilter } from '../../../../shared/utils/predicate';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import {OrderBy, OrderByDirection} from '../../../../shared/utils/predicate';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../../stark-permissions/utils/utils';
import { FundsTransferService } from '../../../services/funds-transfer/funds-transfer.service';
import {LocalStorageService} from '../../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-funds-transfer-list',
  templateUrl: './funds-transfer-list.component.html',
  styleUrls: ['./funds-transfer-list.component.scss']
})
export class FundsTransferListComponent implements OnInit {
  language : string;
  public fundsTransferState = FundsTransferStateEnum;
  public fundsTransferType = FundsTransferTypeEnum;

  fundsTransferStateDataSource: any[] = EnumValues.getNamesAndValues(FundsTransferStateEnum);
  fundsTransferTypeDataSource: any[] = EnumValues.getNamesAndValues(FundsTransferTypeEnum);

  generalPredicate: PredicateFormat[] = [];
  predicateForQuickSearch: PredicateFormat;
  predicateForAdvancedSearch: PredicateFormat;

  public isQuickSearch = true;
    public dateFormat = this.translate.instant(SharedConstant.DATE_FORMAT);
  filterValue = '';
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  public filterFieldsColumns: FiltrePredicateModel[] = [];
  public filterFieldsInputs: FiltrePredicateModel[] = [];

  public gridState: State;
  public columnsConfig: ColumnSettings[] = [
    {
      field: FundsTransferConstant.TRANSFER_DATE,
      title: FundsTransferConstant.DATE_TITLE,
      tooltip: FundsTransferConstant.DATE_TITLE,
      filterable: true
    },
    {
      field: FundsTransferConstant.CODE,
      title: FundsTransferConstant.TRANSFER_CODE_TITLE,
      tooltip: FundsTransferConstant.TRANSFER_CODE_TITLE,
      filterable: true
    },
    {
      field: FundsTransferConstant.TYPE,
      title: FundsTransferConstant.TRANSFER_TYPE_TITLE,
      tooltip: FundsTransferConstant.TRANSFER_TYPE_TITLE,
      filterable: true
    },
    {
      field: FundsTransferConstant.ID_SOURCE_NAVIGATION,
      title: FundsTransferConstant.SOURCE_TITLE,
      tooltip: FundsTransferConstant.SOURCE_TITLE,
      filterable: true
    },
    {
      field: FundsTransferConstant.ID_DESTINATION_NAVIGATION,
      title: FundsTransferConstant.DESTINATION_TITLE,
      tooltip: FundsTransferConstant.DESTINATION_TITLE,
      filterable: true
    },
    {
      field: FundsTransferConstant.STATUS,
      title: FundsTransferConstant.STATE_TITLE,
      tooltip: FundsTransferConstant.STATE_TITLE,
      filterable: true
    },
    {
      field: FundsTransferConstant.AMOUNT_WITH_CURRENCY,
      title: FundsTransferConstant.AMOUNT_WITH_CURRENCY_TITLE,
      tooltip: FundsTransferConstant.AMOUNT_WITH_CURRENCY_TITLE,
      filterable: true
    }
  ];

  gridSettings: GridSettings = {
    state: this.initialiseState(),
    columnsConfig: this.columnsConfig
  };

  initialiseState() {
    return this.gridState = {
      skip: 0,
      take: 20,
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
  }
  // permissions
  hasAddPermission = false;
  hasUpdatePermission = false;
  hasDeletePermission = false;
  hasShowPermission = false;
  constructor(private fundsTransferService: FundsTransferService, private swalWarrings: SwalWarring,
    private router: Router, public translate: TranslateService, private localStorageService : LocalStorageService, private authService: AuthService) {
    this.language = this.localStorageService.getLanguage();
  }

  ngOnInit() {
    this.predicateForAdvancedSearch = this.initialiseAllPredicates();
    this.predicateForQuickSearch = this.initialiseAllPredicates();
    this.initialiseState();
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.ADD_FUNDS_TRANSFER);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.UPDATE_FUNDS_TRANSFER);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.DELETE_FUNDS_TRANSFER);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.SHOW_FUNDS_TRANSFER);
    this.preparePredicate();
    this.initialiseState();
    this.initGridDataSource();
    this.initAdvancedFilterConfig();
  }

  initGridDataSource() {
    this.setGeneralPredicate();
    this.fundsTransferService.reloadServerSideDataWithListPredicate(this.gridSettings.state, this.generalPredicate,
      FundsTransferConstant.GET_DATA_WITH_SPECIFIC_FILTER)
      .subscribe(data => {
      this.gridSettings.gridData = data;
    });
  }
  private setGeneralPredicate() {
    this.generalPredicate = [];
    if (this.isQuickSearch) {
      this.generalPredicate.push(this.predicateForQuickSearch);
    } else {
      this.generalPredicate.push(this.predicateForAdvancedSearch);
    }
  }
  preparePredicate() {
    this.predicateForQuickSearch = new PredicateFormat();
    this.predicateForQuickSearch.Filter = new Array<Filter>();
    this.predicateForQuickSearch.Relation = new Array<Relation>();
    this.predicateForQuickSearch.Relation.push.apply(this.predicateForQuickSearch.Relation, [new Relation(FundsTransferConstant.ID_SOURCE_NAVIGATION),
    new Relation(FundsTransferConstant.ID_DESTINATION_NAVIGATION), new Relation(FundsTransferConstant.ID_CURRENCY_NAVIGATION)]);
  }

  dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.initGridDataSource();
  }

  private initAdvancedFilterConfig() {
    // Static filter columns
    this.filterFieldsColumns.push(new FiltrePredicateModel(FundsTransferConstant.DATE_TITLE,
      FieldTypeConstant.DATE_TYPE, FundsTransferConstant.TRANSFER_DATE));
    this.filterFieldsColumns.push(new FiltrePredicateModel(FundsTransferConstant.TRANSFER_CODE_TITLE,
      FieldTypeConstant.TEXT_TYPE, FundsTransferConstant.CODE));
    this.filterFieldsColumns.push(new FiltrePredicateModel(FundsTransferConstant.TRANSFER_TYPE_TITLE,
       FieldTypeConstant.FUNDS_TRANSFER_TYPE_DROPDOWN_COMPONENT, FundsTransferConstant.TYPE));

    // Dynamic filter columns
    this.filterFieldsInputs.push(new FiltrePredicateModel(FundsTransferConstant.SOURCE_TITLE,
      FieldTypeConstant.CASH_REGISTER_SOURCE_DROPDOWN_COMPONENT, FundsTransferConstant.ID_SOURCE_CASH));
    this.filterFieldsInputs.push(new FiltrePredicateModel(FundsTransferConstant.DESTINATION_TITLE,
      FieldTypeConstant.CASH_REGISTER_DESTINATION_DROPDOWN_COMPONENT, FundsTransferConstant.ID_DESTINATION_CASH));
    this.filterFieldsInputs.push(new FiltrePredicateModel(FundsTransferConstant.STATE_TITLE,
      FieldTypeConstant.FUNDS_TRANSFER_STATE_DROPDOWN_COMPONENT, FundsTransferConstant.STATUS));
    this.filterFieldsInputs.push(new FiltrePredicateModel(FundsTransferConstant.AMOUNT_TITLE,
      FieldTypeConstant.TEXT_TYPE, FundsTransferConstant.AMOUNT_WITH_CURRENCY));
  }

  advancedFilterPredicateChange(filter) {
    this.isQuickSearch = false;
    this.prepareFiltreForAdvancedSearch(filter);
  }

  prepareFiltreForAdvancedSearch(filter){
    this.predicateForAdvancedSearch.Filter = this.predicateForAdvancedSearch.Filter.filter(value => value.prop !== filter.prop);
    if (filter.isDateFiltreBetween && filter.filtres) {
      this.prepareDatesFiltresForAdvancedSearch(filter);
    } else if (filter.operation && isNotNullOrUndefinedAndNotEmptyValue(filter.value) && !filter.SpecificFiltre) {
      this.predicateForAdvancedSearch.Filter.push(filter);
    }
  }
  private prepareDatesFiltresForAdvancedSearch(filter) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filter.filtres[NumberConstant.ZERO].value)) {
      this.predicateForAdvancedSearch.Filter.push(filter.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filter.filtres[NumberConstant.ONE].value)) {
      this.predicateForAdvancedSearch.Filter.push(filter.filtres[NumberConstant.ONE]);
    }
  }

  searchClick() {
    this.isQuickSearch = false;
    this.gridSettings.state = this.initialiseState();
    this.initGridDataSource();
  }

  resetClickEvent() {
    this.isQuickSearch = true;
    this.gridSettings.state = this.initialiseState();
    this.initGridDataSource();
    this.predicateForAdvancedSearch = this.initialiseAllPredicates();
  }

  filterFieldsInputsChange(filter) {
    this.predicateForAdvancedSearch.Filter = this.predicateForAdvancedSearch.Filter
    .filter(value => value.prop !== filter.fieldInput.columnName);
  }

  /**
   * Build the relations for predicates
   */
   initialiseAllPredicates(): PredicateFormat {
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.SpecFilter = new Array<SpecFilter>();
    predicate.SpecificRelation = new Array<string>();
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(FundsTransferConstant.ID_SOURCE_NAVIGATION),
      new Relation(FundsTransferConstant.ID_DESTINATION_NAVIGATION), new Relation(FundsTransferConstant.ID_CURRENCY_NAVIGATION)]);
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push.apply(predicate.OrderBy, [new OrderBy(FundsTransferConstant.ID, OrderByDirection.desc)]);
    return predicate;
  }

  public doFilter() {
    this.predicateForQuickSearch.Filter = new Array<Filter>();
    if (this.filterValue) {
      this.filterValue = this.filterValue ? this.filterValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.filterValue;
      this.predicateForQuickSearch.Filter.push(new Filter(FundsTransferConstant.CODE,
        Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new Filter(FundsTransferConstant.NAME_SOURCE_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new Filter(FundsTransferConstant.CODE_SOURCE_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new Filter(FundsTransferConstant.NAME_DESTINATION_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new Filter(FundsTransferConstant.CODE_DESTINATION_NAVIGATION,
        Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new Filter(FundsTransferConstant.AMOUNT_WITH_CURRENCY,
        Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new Filter(FundsTransferConstant.CODE_CURRENCY_NAVIGATION,
        Operation.contains, this.filterValue, false, true));

      // Specific filter for Type
      this.fundsTransferTypeDataSource.forEach(elem => {
        this.translate.get(elem.name.toUpperCase()).subscribe(trans => elem.name = trans);
      });
      const fundsTransferTypeFiltered = this.fundsTransferTypeDataSource
        .filter(x => x.name.toLowerCase().indexOf(this.filterValue.toLowerCase()) !== -1);
      if (fundsTransferTypeFiltered) {
        const type: any[] = fundsTransferTypeFiltered.map(x => x.value);
        type.forEach((x) => {
          this.predicateForQuickSearch.Filter.push(new Filter(FundsTransferConstant.TYPE, Operation.eq, x, false, true));
        });
      }
    }
    this.gridSettings.state = this.initialiseState();
    this.initGridDataSource();
  }

  goToAdvancedEdit(id) {
    this.router.navigateByUrl(FundsTransferConstant.NAVIGATE_TO_EDIT_FUNDS_TRANSFER.concat(id));
  }
  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result: { value: any; }) => {
      if (result.value) {
        this.fundsTransferService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.initialiseState();
          this.initGridDataSource();
        });
      }
    });
  }

}
