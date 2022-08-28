import {Component, OnInit, ViewChild} from '@angular/core';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {DataStateChangeEvent, GridComponent, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {FabricationArrangementConstant} from '../../../constant/manufuctoring/fabricationArrangement.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {Router} from '@angular/router';
import {ItemService} from '../../../inventory/services/item/item.service';
import {TiersService} from '../../../purchase/services/tiers/tiers.service';
import {TiersConstants} from '../../../constant/purchase/tiers.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Subscription} from 'rxjs/Subscription';
import {FabricationArrangementService} from '../../service/fabrication-arrangement.service';
import {EmployeeService} from '../../../payroll/services/employee/employee.service';
import {filter} from '@progress/kendo-data-query/dist/npm/transducers';
import {DatePipe} from '@angular/common';
import {Filter} from '../../../models/accounting/Filter';
import {FiltrePredicateModel} from '../../../models/shared/filtrePredicate.model';
import {isNullOrUndefined} from 'util';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import {AdvancedSearchProductionService} from '../../advanced-search-shared/advanced-search-production.service';
import {Filter as predicate, Operator, PredicateFormat,} from '../../../shared/utils/predicate';
import {Operation} from '../../../../COM/Models/operations';
import {PermissionConstant} from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-fabrication-arrangement',
  templateUrl: './list-fabrication-arrangement.component.html',
  styleUrls: ['./list-fabrication-arrangement.component.scss'],
})
export class ListFabricationArrangementComponent implements OnInit {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  private currentPage = NumberConstant.ZERO;
  private size = NumberConstant.TEN;
  private subscription$: Subscription;
  public value = '';
  public currentStatus = 'confirmed';
  private listFabs: Array<any> = [];
  /************ Advanced filter attributes ****/
  public predicateAdvancedSearch: PredicateFormat;
  public filterFieldsColumns = [];
  public filterFieldsInputs = [];
  public searchType = NumberConstant.ONE;
  public sortParams = '';
  public filters = new Array<Filter>();
  public predicateIdTypeTiers: PredicateFormat;
  /************End Advanced filter attributes ****/
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: this.size,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: FabricationArrangementConstant.FABRICATION_ID_FIELD,
      title: FabricationArrangementConstant.FABRICATION_ID_TITLE,
      filterable: true,
    }, {
      field: FabricationArrangementConstant.FABRICATION_STATUS_FIELD,
      title: FabricationArrangementConstant.FABRICATION_STATUS_TITLE,
      filterable: true,
    }, {
      field: FabricationArrangementConstant.FABRICATION_DATE_DELIVERY_FIELD,
      title: FabricationArrangementConstant.FABRICATION_DATE_DELIVERY_TITLE,
      filterable: true,
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  // Grid quick add
  public formGroup: FormGroup;
  @ViewChild(GridComponent) grid: GridComponent;

  btnEditVisible: boolean;
  date: Date;

  public MANUFACTURINGPermissions = PermissionConstant.MANUFATORINGPermissions;
  constructor(
    public authService: AuthService,
    public employeeService: EmployeeService,
    private advancedSearchProduction: AdvancedSearchProductionService,
    public fabricationArrangementService: FabricationArrangementService,
    public tiersService: TiersService,
    public itemService: ItemService,
    private router: Router,
    private swalWarrings: SwalWarring,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private growlService: GrowlService,
    private translate: TranslateService) {

    this.predicate = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.btnEditVisible = true;
  }


  gridDataSource(pageFilter?: number) {
    if (pageFilter != null) {
      this.currentPage = pageFilter;
    }
    this.subscription$ =
      this.fabricationArrangementService.callService(Operation.POST, FabricationArrangementConstant.GET_FABRICATIONARRANGEMENT_PAGEABLE +
          `?page=${this.currentPage}&size=${this.size}${this.sortParams}`, this.filters)
        .subscribe((data) => {
          data.content.map(of => {
            of.status = this.translate.instant(of.status);
            of.dateDelivery = this.datePipe.transform(of.dateDelivery, SharedConstant.PIPE_FORMAT_DATE__DD_MM_YYYY);
            return of;
          });
          this.gridSettings.gridData = {data: data.content, total: data.totalElements};
        });
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.fabricationArrangementService.getJavaGenericService()
          .deleteEntity(dataItem.id, FabricationArrangementConstant.FABRICATION_URL).subscribe(() => {
          this.growlService.successNotification(this.translate.instant(FabricationArrangementConstant.SUCCESS_OPERATION));
          this.gridDataSource();
        }, () => {
          this.growlService.ErrorNotification(this.translate.instant(FabricationArrangementConstant.FAILURE_OPERATION));
        });
      }
    });
  }


  /**
   * load data when the page change with pagination
   * @param event
   */  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / event.take;
    this.size = event.take;
    this.gridDataSource(this.currentPage);
  }

  /**
   * load data into active page
   */
  goPage() {
    this.fabricationArrangementService
      .getJavaGenericService().getEntityList(FabricationArrangementConstant.GET_FABRICATIONARRANGEMENT_PAGEABLE
      + `?page=${this.currentPage}&size=${this.size}`).subscribe((data) => {
      data.forEach(of => {
        this.itemService.getById(of.productId).subscribe(res => {
          of.description = res[FabricationArrangementConstant.FABRICATION_DESCRIPTION];
        });
        this.employeeService.getById(of.responsableId).subscribe(res => {
          of.FullName = res[FabricationArrangementConstant.FABRICATION_RESPONSIBLE];
        });
      });
      this.gridSettings.gridData = {data: data.content, total: data.totalElements};
    });
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl
    (FabricationArrangementConstant.URI_ADVANCED_EDIT.concat(dataItem.id), {queryParams: filter, skipLocationChange: true});
  }

  ngOnInit() {
    this.initPredicateAdvancedSearch();
    this.initFilterFiledConfig();
    this.gridDataSource();
  }

  export() {
    const fabIdResponsibleNameMap = {};
    const fabIdPoductDescriptionMap = {};
    const idProducts: Array<number> = [];
    this.subscription$ = this.fabricationArrangementService.getJavaGenericService()
      .getEntityList(FabricationArrangementConstant.GET_FABRICATIONARRANGEMENT_PAGEABLE
        + `?page=${this.currentPage}&size=${this.size}`)
      .flatMap(fabs => {
        this.listFabs = fabs.content;
        const idEmployees: Array<number> = [];
        this.listFabs.forEach((element) => {
          idEmployees.push(element.responsableId);
          idProducts.push(element.productId);
        });
        return this.employeeService.getEmployeesDetails(idEmployees);
      }).flatMap(employees => {
        this.listFabs.forEach(fab => {
          employees.forEach(emp => {
            if (fab.responsableId === emp.Id) {
              fabIdResponsibleNameMap[fab.id] = emp.FullName;
            }
          });
        });
        return this.itemService.getItemListDetailByIds(idProducts);
      }).flatMap((products) => {
        this.listFabs.forEach(fab => {
          products.forEach(product => {
            if (fab.productId === product.Id) {
              fabIdPoductDescriptionMap[fab.id] = product.Description;
            }
          });
        });
        const fabInfoMap = {
          'responsible': fabIdResponsibleNameMap,
          'product': fabIdPoductDescriptionMap,
        };
        return this.fabricationArrangementService.readReport(FabricationArrangementConstant.REPORT_LIST_FAB, fabInfoMap);
      }).subscribe((response) => {
          const blob = new Blob([response], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        }
      );
  }

  /************************Advanced filter begin methods ******************/

  initPredicateAdvancedSearch() {
    this.filters = [];
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<predicate>();
  }

  private initFilterFiledConfig() {
    this.filterFieldsColumns.push(new FiltrePredicateModel(FabricationArrangementConstant.FABRICATION_ID_TITLE,
        FabricationArrangementConstant.STRING_TYPE, FabricationArrangementConstant.FABRICATION_ID_FIELD),
      new FiltrePredicateModel(FabricationArrangementConstant.FABRICATION_LINE_ITEM_TITLE,
        FabricationArrangementConstant.DROPDOWN_ARTICLE_TYPE, FabricationArrangementConstant.FABRICATION_LINE_ITEM_FIELD),
      new FiltrePredicateModel(FabricationArrangementConstant.FABRICATION_DATE_DELIVERY_TITLE,
        FabricationArrangementConstant.DATE_TYPE, FabricationArrangementConstant.FABRICATION_DATE_DELIVERY_FIELD),
    new FiltrePredicateModel(FabricationArrangementConstant.FABRICATION_STATUS_TITLE,
      FabricationArrangementConstant.DROPDOWN_TYPE, FabricationArrangementConstant.FABRICATION_STATUS_FIELD));
  }

  /**
   * case filtre date between : we don't remove the old filtre date value
   * @param filtre
   * @private
   */
  public prepareFiltreFromAdvancedSearch(filtreFromAdvSearch) {
    this.predicateAdvancedSearch.Filter = this.predicateAdvancedSearch.Filter.filter(value => value.prop !== filtreFromAdvSearch.prop);
    if (filtreFromAdvSearch.isDateFiltreBetween) {
      this.prepareDatesFiltres(filtreFromAdvSearch);
    }
    if (filtreFromAdvSearch.operation && !isNullOrUndefined(filtreFromAdvSearch.value) && !filtreFromAdvSearch.SpecificFiltre) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch);
    }
  }

  private prepareDatesFiltres(filtreFromAdvSearch) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ZERO].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ONE].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    }
  }

  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  resetClickEvent() {
    this.initPredicateAdvancedSearch();
    this.gridDataSource();
  }

  getFieldType(filtered: predicate): string {
    const type = this.advancedSearchProduction.getType(filtered, this.filterFieldsColumns, this.filterFieldsInputs);
    return this.advancedSearchProduction.getFilterType(type);
  }

  getOperation(filtered: predicate): string {
    return this.advancedSearchProduction.getOperation(filtered, this.filterFieldsColumns, this.filterFieldsInputs);
  }
  prepareFilter() {
    const filters = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.forEach(filtered => {
      filters.push(new Filter(this.getFieldType(filtered), this.getOperation(filtered), filtered.prop, filtered.value));
    });
    return filters;
  }

  searchClick() {
    this.filters = this.prepareFilter();
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.gridDataSource();
  }
}
