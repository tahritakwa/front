import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values/src/enumValues';
import { concatStatic } from 'rxjs/operator/concat';
import { isNullOrUndefined } from 'util';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { Company } from '../../../models/administration/company.model';
import { Currency } from '../../../models/administration/currency.model';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { InterventionOrderStateEnumerator } from '../../../models/enumerators/intervention-order-state.enum';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { ModelOfItemComboBoxComponent } from '../../../shared/components/model-of-item-combo-box/model-of-item-combo-box.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { LanguageService } from '../../../shared/services/language/language.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation, SpecFilter } from '../../../shared/utils/predicate';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { InterventionService } from '../../services/intervention/intervention.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
@Component({
  selector: 'app-list-intervention-order.component',
  templateUrl: './list-intervention-order.component.html',
  styleUrls: ['./list-intervention-order.component.scss']
})
export class ListInterventionOrderComponent implements OnInit {
  interventionSearchFormGroup: FormGroup;
  @ViewChild('modelOfItemChild') modelOfItemChild: ModelOfItemComboBoxComponent;
  dateFormat = this.translateService.instant(SharedConstant.DATE_FORMAT);
  companyCurrency: Currency;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  language: string;
  predicateForQuickSearch: PredicateFormat;
  predicateForAdvancedSearch: PredicateFormat;
  generalPredicate: PredicateFormat[] = [];
  /**
 * flag to identify the searchType
 * advanced search = 0 ,quick search = 1
 */
  public isQuickSearch = true;
  selectedIdTiers: number;
  filterValue = '';
  gridState: State;
  interventionState = InterventionOrderStateEnumerator;
  interventionStateDataSource: any[] = EnumValues.getNamesAndValues(InterventionOrderStateEnumerator);
  public filterFieldsColumns: FiltrePredicateModel[] = [];
  public filterFieldsInputs: FiltrePredicateModel[] = [];
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_ID_TIERS,
      title: GarageConstant.CUSTOMER,
      filterable: true,
      tooltip: GarageConstant.CUSTOMER
    },
    {
      field: GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_ID_VEHICLE_MODEL,
      title: GarageConstant.MODEL_TITLE,
      filterable: true,
      tooltip: GarageConstant.MODEL_TITLE
    },
    {
      field: GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_REGISTRATION_NUMBER,
      title: GarageConstant.REGISTRATION_NUMBER_TITLE,
      filterable: true,
      tooltip: GarageConstant.REGISTRATION_NUMBER_TITLE
    },
    {
      field: GarageConstant.CODE,
      title: GarageConstant.CODE_TITLE,
      filterable: true,
      tooltip: GarageConstant.CODE_TITLE
    },
    {
      field: GarageConstant.ID_DELIVERY_DOCUMENT,
      title: GarageConstant.CODE_DELIVERY_TITLE,
      filterable: true,
      tooltip: GarageConstant.CODE_DELIVERY_TITLE
    },
    {
      field: GarageConstant.ID_INVOICE_DOCUMENT,
      title: GarageConstant.CODE_INVOICE_TITLE,
      filterable: true,
      tooltip: GarageConstant.CODE_INVOICE_TITLE
    },
    {
      field: GarageConstant.INTERVENTION_DATE,
      title: GarageConstant.DATE,
      filterable: true,
      tooltip: GarageConstant.DATE
    },
    {
      field: GarageConstant.STATUS,
      title: GarageConstant.STATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.STATE_TITLE
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
  // Permission Parameters
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
    constructor(private swalWarrings: SwalWarring, private router: Router, public interventionService: InterventionService, private authService: AuthService,
    private translateService: TranslateService, private companyService: CompanyService, private localStorageService : LocalStorageService) {
      this.language = this.localStorageService.getLanguage();
     }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.ADD_INTERVENTION);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.UPDATE_INTERVENTION);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.SHOW_INTERVENTION);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.GaragePermissions.DELETE_INTERVENTION);
    // company currency
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.companyCurrency = data.IdCurrencyNavigation;
    });
    this.predicateForAdvancedSearch = this.initialiseAllPredicates();
    this.predicateForQuickSearch = this.initialiseAllPredicates();
    this.initialiseState();
    this.setGeneralPredicate();
    this.initGridDataSource();
    this.interventionStateDataSource.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translateService.get(elem.name).subscribe(trans => elem.name = trans);
    });
    this.initAdvancedFilterConfig();
  }

  initGridDataSource() {
    this.interventionService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
      this.generalPredicate, GarageConstant.GET_INTERVENTION_LIST).subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  dataStateChange(state: State) {
    this.setGeneralPredicate();
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  public doFilter() {
    this.isQuickSearch = true;
    this.predicateForQuickSearch.Filter = new Array<Filter>();
    if (this.filterValue) {
      this.filterValue = this.filterValue ? this.filterValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.filterValue;
      this.predicateForQuickSearch.Filter.push(new
        Filter(GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_ID_VEHICLE_BRAND_NAVIGATION_TO_DESIGNATION,
          Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new
        Filter(GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_ID_VEHICLE_MODEL_NAVIGATION_TO_DESIGNATION,
          Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new
        Filter(GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_REGISTRATION_NUMBER,
          Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new Filter(GarageConstant.CODE,
        Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new
        Filter(GarageConstant.INTERVENTION_DATE, Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new Filter(GarageConstant.TTC_PRICE, Operation.contains, this.filterValue, false, true));

      // Specific filter for status
      const interventionStatusFiltered = this.interventionStateDataSource
        .filter(x => x.name.toLowerCase().indexOf(this.filterValue.toLowerCase()) !== -1);
      if (interventionStatusFiltered) {
        const status: any[] = interventionStatusFiltered.map(x => x.value);
        status.forEach((x) => {
          this.predicateForQuickSearch.Filter.push(new Filter(GarageConstant.STATUS, Operation.eq, x, false, true));
        });
      }
    }
    this.generalPredicate = [];
    this.generalPredicate.push(this.mergefilters());
    this.gridSettings.state = this.initialiseState();
    this.initGridDataSource();
  }

  private setGeneralPredicate() {
    this.generalPredicate = [];
    if (this.isQuickSearch) {
      this.generalPredicate.push(this.predicateForQuickSearch);
    } else {
      this.generalPredicate.push(this.predicateForAdvancedSearch);
    }
  }

  private initAdvancedFilterConfig() {
    // Static filter columns
    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.REGISTRATION_NUMBER_TITLE,
      FieldTypeConstant.REGISTRATION_NUMBER_OF_VEHICLE_DROPDWON_COMPONENT,
      GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_REGISTRATION_NUMBER));
    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.CUSTOMER, FieldTypeConstant.customerComponent,
      GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_ID_TIERS));
    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.STATE_TITLE,
      FieldTypeConstant.INTERVENTION_STATE_DROPDOWN_COMPONENT,
      GarageConstant.STATUS));

    // Dynamic filter columns
    this.filterFieldsInputs.push(new FiltrePredicateModel(GarageConstant.MODEL_TITLE, FieldTypeConstant.VEHICLE_MODEL_DROPDOWN_COMPONENT,
      GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_ID_VEHICLE_MODEL));
    this.filterFieldsInputs.push(new FiltrePredicateModel(GarageConstant.DATE, FieldTypeConstant.DATE_TYPE,
      GarageConstant.INTERVENTION_DATE));
  }

  getFiltrePredicate(filtre) {
    this.isQuickSearch = false;
    this.generalPredicate = [];
    this.prepareFiltreForAdvancedSearch(filtre);
    this.generalPredicate.push(this.mergefilters());
  }
  mergefilters() {
    const predicate = new PredicateFormat();
     if (this.predicateForAdvancedSearch) {
       this.cloneAdvancedSearchPredicate(predicate);
     }
    if (this.predicateForQuickSearch.Filter.length !== NumberConstant.ZERO) {
      predicate.Filter = predicate.Filter.concat(this.predicateForQuickSearch.Filter);
    }
    return (predicate);
  }

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat){
    targetPredicate.Filter = this.predicateForAdvancedSearch.Filter;
    targetPredicate.IsDefaultPredicate = this.predicateForAdvancedSearch.IsDefaultPredicate;
    targetPredicate.Operator = this.predicateForAdvancedSearch.Operator;
    targetPredicate.OrderBy = this.predicateForAdvancedSearch.OrderBy;
    targetPredicate.Relation = this.predicateForAdvancedSearch.Relation;
    targetPredicate.SpecFilter = this.predicateForAdvancedSearch.SpecFilter;
    targetPredicate.SpecificRelation = this.predicateForAdvancedSearch.SpecificRelation;
    targetPredicate.page = this.predicateForAdvancedSearch.page;
    targetPredicate.pageSize = this.predicateForAdvancedSearch.pageSize;
    targetPredicate.values = this.predicateForAdvancedSearch.values;
  }

  /**
   * Prepare filter for advanced search
   * @private
   * @param filter
   */
  private prepareFiltreForAdvancedSearch(filter) {
    this.predicateForAdvancedSearch.Filter = this.predicateForAdvancedSearch.Filter.filter(value => value.prop !== filter.prop);
    if (filter.isDateFiltreBetween) {
      this.prepareDatesFiltresForAdvancedSearch(filter);
    } else if (filter.operation && !isNullOrUndefined(filter.value)) {
      this.predicateForAdvancedSearch.Filter.push(filter);
    }
  }

  /**
   * Prepare date filter
   * @private
   * @param filter
   */
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
    this.predicateForAdvancedSearch = this.initialiseAllPredicates();
    this.generalPredicate = [];
    this.generalPredicate.push(this.mergefilters());
    this.gridSettings.state = this.initialiseState();
    this.initGridDataSource();
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
    predicate.Relation.push.apply(predicate.Relation,
      [new Relation(GarageConstant.ID_RECEPTION_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation,
      [new Relation(GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation,
      [new Relation(GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_ID_VEHICLE_MODEL_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation,
      [new Relation(GarageConstant.ID_RECEPTION_NAVIGATION_TO_ID_VEHICLE_NAVIGATION_TO_ID_VEHICLE_BRAND_NAVIGATION)]);
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push.apply(predicate.OrderBy, [new OrderBy(GarageConstant.ID_UPPER_CASE, OrderByDirection.desc)]);
    return predicate;
  }

  goToAdvancedEdit(id) {
    this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_EDIT_INTERVENTION_ORDER.concat(id));
  }

  goToEditDelivery(document: any) {
    let url = GarageConstant.NAVIGATE_TO_SALES_DELIVERY_URL;
    if (document.IdDocumentStatus !== documentStatusCode.Provisional && document.IdDocumentStatus !== documentStatusCode.DRAFT) {
      url = url.concat(GarageConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    } else {
      url = url.concat('edit').concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    }
    this.router.navigate([]).then(() => {
      window.open(url, '_blank');
    });
  }

  goToEditInvoice(document: any) {
    let url = GarageConstant.NAVIGATE_TO_SALES_INVOICE_URL;
    if (document.IdDocumentStatus !== documentStatusCode.Provisional && document.IdDocumentStatus !== documentStatusCode.DRAFT) {
      url = url.concat(GarageConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    } else {
      url = url.concat('edit').concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
    }
    this.router.navigate([]).then(() => {
      window.open(url, '_blank');
    });
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result: { value: any; }) => {
      if (result.value) {
        this.interventionService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.initialiseState();
          this.initGridDataSource();
        });
      }
    });
  }

  tiersPictureSrc(dataItem) {
    if (dataItem.TiersPictureFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.TiersPictureFileInfo.Data;
    }
  }

  vehicleBrandPictureSrc(dataItem) {
    if (dataItem.VehicleBrandPictureFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.VehicleBrandPictureFileInfo.Data;
    }
  }


}
