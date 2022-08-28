import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { DataResult, State } from '@progress/kendo-data-query';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { InterventionOrderStateEnumerator } from '../../../models/enumerators/intervention-order-state.enum';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation, SpecFilter } from '../../../shared/utils/predicate';
import { InterventionService } from '../../services/intervention/intervention.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { FiltrePredicateModel } from '../../../models/shared/filtrePredicate.model';
import { FieldTypeConstant } from '../../../constant/shared/fieldType.constant';
import { isNullOrUndefined } from 'util';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';

@Component({
  selector: 'app-customer-vehicle-history',
  templateUrl: './customer-vehicle-history.component.html',
  styleUrls: ['./customer-vehicle-history.component.scss']
})
export class CustomerVehicleHistoryComponent implements OnInit {
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  dateFormat = this.localStorageService.getFormatDate();
  idVehicle: number;
  public filterFieldsColumns: FiltrePredicateModel[] = [];
  public filterFieldsInputs: FiltrePredicateModel[] = [];
  predicateForAdvancedSearch: PredicateFormat = new PredicateFormat();
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    },
    sort: [
      {
        field: 'Id',
        dir: 'desc'
      }
    ],
    group: []
  };

  columnsConfig: ColumnSettings[] = [
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
      title: GarageConstant.DATE_INTERVENTION_TITLE,
      filterable: true,
      tooltip: GarageConstant.DATE_INTERVENTION_TITLE
    },
    {
      field: GarageConstant.STATUS,
      title: GarageConstant.STATE_TITLE,
      filterable: true,
      tooltip: GarageConstant.STATE_TITLE
    }
  ];

  gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  public filterValue = '';
  interventionState = InterventionOrderStateEnumerator;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private translate: TranslateService,
    private interventionService: InterventionService, private localStorageService: LocalStorageService) {
    this.activatedRoute.params.subscribe(params => {
      this.idVehicle = +params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
    });
  }

  ngOnInit() {
    this.predicateForAdvancedSearch = this.initialiseAllPredicates();
    this.initGridDataSource();
    this.initAdvancedFilterConfig();

  }
  initGridDataSource() {
    this.interventionService.getCustomerVehicleHistory(this.gridSettings.state,
      this.predicateForAdvancedSearch, this.idVehicle).subscribe((data) => {
        this.gridSettings.gridData = new Object() as DataResult;
        this.gridSettings.gridData.data = data.listData;
        this.gridSettings.gridData.total = data.total;
      });
  }

  private initAdvancedFilterConfig() {
    // Static filter columns
    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.CODE_TITLE,
      FieldTypeConstant.TEXT_TYPE, GarageConstant.CODE));

  
    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.DATE_INTERVENTION_TITLE,
      FieldTypeConstant.DATE_TYPE,
      GarageConstant.INTERVENTION_DATE));

    this.filterFieldsColumns.push(new FiltrePredicateModel(GarageConstant.STATE_TITLE,
      FieldTypeConstant.INTERVENTION_STATE_DROPDOWN_COMPONENT,
      GarageConstant.STATUS));
  }
    /**
  * Build the relations for predicates
  */
     initialiseAllPredicates(): PredicateFormat {
      const predicate = new PredicateFormat();
      predicate.Filter = new Array<Filter>();
      predicate.Filter.push(new Filter(GarageConstant.ID_VEHICLE, Operation.eq, this.idVehicle));
      predicate.SpecFilter = new Array<SpecFilter>();
      predicate.SpecificRelation = new Array<string>();
      predicate.Relation = new Array<Relation>();
      predicate.OrderBy = new Array<OrderBy>();
      predicate.OrderBy.push.apply(predicate.OrderBy, [new OrderBy(GarageConstant.ID_UPPER_CASE, OrderByDirection.desc)]);
      return predicate;
    }
    filterFieldsInputsChange(filter) {
      this.predicateForAdvancedSearch.Filter = this.predicateForAdvancedSearch.Filter
        .filter(value => value.prop !== filter.fieldInput.columnName);
    }
    searchClick() {
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.gridSettings.state.take = NumberConstant.TWENTY;
      this.initGridDataSource();
    }
  
    advancedFilterPredicateChange(filtre) {
      this.prepareFiltreForAdvancedSearch(filtre);
    }
    resetClickEvent() {
      this.gridSettings.state.skip = NumberConstant.ZERO;
      this.gridSettings.state.take = NumberConstant.TWENTY;
      this.predicateForAdvancedSearch = this.initialiseAllPredicates();
      this.initGridDataSource();
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

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }


  goToAdvancedEdit(id) {
    const url = GarageConstant.NAVIGATE_TO_EDIT_INTERVENTION_ORDER.concat(id);
    this.router.navigate([]).then(() => {
      window.open(url, '_blank');
    });
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

  goToEditInvoice(document) {
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
}
