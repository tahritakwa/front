import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { isNullOrUndefined } from 'util';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { RepairOrderStateEnumerator } from '../../../models/enumerators/repair-order-state.enum';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation, SpecFilter } from '../../../shared/utils/predicate';
import { RepairOrderService } from '../../services/repair-order/repair-order.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-list-repair-order',
  templateUrl: './list-repair-order.component.html',
  styleUrls: ['./list-repair-order.component.scss']
})
export class ListRepairOrderComponent implements OnInit {
  dateFormat = this.localStorageService.getFormatDate();
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  filterValue = '';
  repairOrderState = RepairOrderStateEnumerator;
  gridState: State;
  predicateForQuickSearch: PredicateFormat;
  predicateForAdvancedSearch: PredicateFormat;
  generalPredicate: PredicateFormat[] = [];
  public filterFieldsColumns: FiltrePredicateModel[] = [];
  public filterFieldsInputs: FiltrePredicateModel[] = [];
   /**
 * flag to identify the searchType
 * advanced search = 0 ,quick search = 1
 */
  public isQuickSearch = true;
  repairOrderStateDataSource: any[] = EnumValues.getNamesAndValues(RepairOrderStateEnumerator);
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.CODE,
      title: GarageConstant.CODE_TITLE,
      filterable: true,
      tooltip: GarageConstant.CODE_TITLE
    },
    {
      field: GarageConstant.ID_TIERS_NAVIGATION_NAME,
      title: GarageConstant.CUSTOMER,
      filterable: true,
      tooltip: GarageConstant.CUSTOMER
    },
    {
      field: GarageConstant.ID_QUOTATION_NAVIGATION_CODE,
      title: GarageConstant.CODE_QUOTATION_TITLE,
      filterable: true,
      tooltip: GarageConstant.CODE_QUOTATION_TITLE
    },
    {
      field: GarageConstant.ID_VEHICLE_NAVIGATION_ID_VEHICLE_MODEL,
      title: GarageConstant.MODEL_TITLE,
      filterable: true,
      tooltip: GarageConstant.MODEL_TITLE
    },
    {
      field: GarageConstant.ID_VEHICLE_NAVIGATION_TO_REGISTRATION_NUMBER,
      title: GarageConstant.REGISTRATION_NUMBER_TITLE,
      filterable: true,
      tooltip: GarageConstant.REGISTRATION_NUMBER_TITLE
    },
    {
      field: GarageConstant.ID_GARAGE_NAVIGATION_NAME,
      title: GarageConstant.GARAGE_NAME_TITLE,
      filterable: true,
      tooltip: GarageConstant.GARAGE_NAME_TITLE
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
  constructor(public repairOrderService: RepairOrderService, private router: Router,
    private swalWarrings: SwalWarring, private translateService: TranslateService , private localStorageService : LocalStorageService) { }

  ngOnInit() {
    this.predicateForQuickSearch = this.initialiseAllPredicates();
    this.predicateForAdvancedSearch = this.initialiseAllPredicates();
    this.initialiseState();
    this.setGeneralPredicate();
    this.initGridDataSource();
    this.repairOrderStateDataSource.forEach(elem => {
      elem.name = elem.name.toUpperCase();
      this.translateService.get(elem.name).subscribe(trans => elem.name = trans);
    });
    this.initAdvancedFilterConfig();
  }
  initGridDataSource() {
    this.repairOrderService.reloadServerSideDataWithListPredicate(this.gridSettings.state,
      this.generalPredicate, GarageConstant.GET_REPAIR_ORDER_LIST).subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }
  setGeneralPredicate() {
    this.generalPredicate = [];
    if (this.isQuickSearch) {
      this.generalPredicate.push(this.predicateForQuickSearch);
    } else {
      this.generalPredicate.push(this.predicateForAdvancedSearch);
    }
}

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
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
      [new Relation(GarageConstant.ID_VEHICLE_NAVIGATION)]);
      predicate.Relation.push.apply(predicate.Relation,
        [new Relation(GarageConstant.ID_VEHICLE_NAVIGATION_TO_ID_VEHICLE_BRAND_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation,
      [new Relation(GarageConstant.ID_VEHICLE_NAVIGATION_TO_ID_VEHICLE_MODEL_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation,
      [new Relation(GarageConstant.ID_GARAGE_NAVIGATION)]);
    predicate.OrderBy = new Array<OrderBy>();
    predicate.OrderBy.push.apply(predicate.OrderBy, [new OrderBy(GarageConstant.ID_UPPER_CASE, OrderByDirection.desc)]);
    return predicate;
  }

  private initAdvancedFilterConfig() {
    // Static filter columns
    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.CUSTOMER,
      FieldTypeConstant.customerComponent,
      GarageConstant.ID_TIERS));
      this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.REGISTRATION_NUMBER_TITLE,
        FieldTypeConstant.REGISTRATION_NUMBER_OF_VEHICLE_DROPDWON_COMPONENT,
        GarageConstant.ID_VEHICLE_NAVIGATION_TO_REGISTRATION_NUMBER));
    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.GARAGE_NAME_TITLE,
      FieldTypeConstant.GARAGE_DROPDOWN_COMPONENT,
      GarageConstant.ID_GARAGE));

    // Dynamic filter columns
    this.filterFieldsInputs.push(new FiltrePredicateModel(GarageConstant.STATE_TITLE,
      FieldTypeConstant.REPAIR_ORDER_STATE_DROPDOWN_COMPONENT,
      GarageConstant.STATUS));
  }

  doFilter() {
    this.isQuickSearch = true;
    this.predicateForQuickSearch.Filter = new Array<Filter>();
    if (this.filterValue) {
      this.filterValue = this.filterValue ? this.filterValue.replace(/\s+/g, SharedConstant.BLANK_SPACE) : this.filterValue;
      this.predicateForQuickSearch.Filter.push(new Filter(GarageConstant.CODE, Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new
        Filter(GarageConstant.ID_VEHICLE_NAVIGATION_TO_ID_VEHICLE_MODEL_NAVIGATION_TO_DESIGNATION,
          Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new
        Filter(GarageConstant.ID_VEHICLE_NAVIGATION_TO_ID_VEHICLE_BRAND_NAVIGATION_TO_DESIGNATION,
          Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new
        Filter(GarageConstant.ID_VEHICLE_NAVIGATION_TO_REGISTRATION_NUMBER,
          Operation.contains, this.filterValue, false, true));
      this.predicateForQuickSearch.Filter.push(new
        Filter(GarageConstant.ID_GARAGE_NAVIGATION_NAME,
          Operation.contains, this.filterValue, false, true));
      // Specific filter for status
      const repairOrderStatusFiltered = this.repairOrderStateDataSource
        .filter(x => x.name.toLowerCase().indexOf(this.filterValue.toLowerCase()) !== -1);
      if (repairOrderStatusFiltered) {
        const status: any[] = repairOrderStatusFiltered.map(x => x.value);
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
  
  goToAdvancedEdit(id) {
    this.router.navigateByUrl(GarageConstant.NAVIGATE_TO_EDIT_REPAIR_ORDER.concat(id));
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result: { value: any; }) => {
      if (result.value) {
        this.repairOrderService.remove(dataItem).subscribe(() => {
          this.gridSettings.state = this.initialiseState();
          this.initGridDataSource();
        });
      }
    });
  }

  tiersPictureSrc(dataItem) {
    if (dataItem && dataItem.TiersPictureFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.TiersPictureFileInfo.Data;
    }
  }

  vehicleBrandPictureSrc(dataItem) {
    if (dataItem && dataItem.VehicleBrandPictureFileInfo) {
      return SharedConstant.PICTURE_BASE + dataItem.VehicleBrandPictureFileInfo.Data;
    }
  }

  goToEditQuotation(document: any) {
      let url = GarageConstant.NAVIGATE_TO_SALES_QUOTATION_URL;
      if (document.IdDocumentStatus !== documentStatusCode.Provisional && document.IdDocumentStatus !== documentStatusCode.DRAFT) {
        url = url.concat(GarageConstant.SHOW).concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
      } else {
        url = url.concat('edit').concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus);
      }
      this.router.navigate([]).then(() => {
        window.open(url, '_blank');
      });
  }

  getFiltrePredicate(filtre) {
    this.isQuickSearch = false;
    this.generalPredicate = [];
    this.prepareFiltreForAdvancedSearch(filtre);
    this.generalPredicate.push(this.mergefilters());
  }
  /**
   * Prepare filter for advanced search
   * @private
   * @param filter
   */
   private prepareFiltreForAdvancedSearch(filter) {
    this.predicateForAdvancedSearch.Filter = this.predicateForAdvancedSearch.Filter.filter(value => value.prop !== filter.prop);
    if (filter.operation && !isNullOrUndefined(filter.value)) {
      this.predicateForAdvancedSearch.Filter.push(filter);
    }
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

  public cloneAdvancedSearchPredicate(targetPredicate: PredicateFormat) {
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

}
