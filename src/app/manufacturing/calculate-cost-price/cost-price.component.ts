import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataStateChangeEvent, GridComponent, PageChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {NumberConstant} from '../../constant/utility/number.constant';
import {FormGroup} from '@angular/forms';
import {DataSourceRequestState, State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {CalculateCostPriceConstant} from '../../constant/manufuctoring/calculateCostPrice.constant';
import {Subscription} from 'rxjs/Subscription';
import {GammeService} from '../service/gamme.service';
import {ItemService} from '../../inventory/services/item/item.service';
import {Gamme} from '../../models/manufacturing/gamme.model';
import {preparePredicateFilterToGetCostPrice} from '../manufactoring-shared/prepare-predicate-cost-price';
import {DatePipe} from '@angular/common';
import {Operation} from '../../../COM/Models/operations';
import {FabricationArrangementConstant} from '../../constant/manufuctoring/fabricationArrangement.constant';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';
import {Filter} from '../../models/accounting/Filter';
import { NumberFormatOptions } from '@progress/kendo-angular-intl';
import { CompanyService } from '../../administration/services/company/company.service';
import { Currency } from '../../models/administration/currency.model';



const OPERATION_PER_NEED_URL = '/main/manufacturing/needs-per-operation/article/';
import {
  Filter as predicate,
  Operator,
  PredicateFormat,
} from '../../shared/utils/predicate';
import {FiltrePredicateModel} from '../../models/shared/filtrePredicate.model';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../stark-permissions/utils/utils';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {AdvancedSearchProductionService} from '../advanced-search-shared/advanced-search-production.service';

@Component({
  selector: 'app-cost-price',
  templateUrl: './cost-price.component.html',
})
export class CostPriceComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  private currentPage = NumberConstant.ZERO;
  private size = NumberConstant.TEN;
  public sortParams = '';
  public formGroup: FormGroup;
  private subscription$: Subscription;
  public value = '';
  public spinner = true;
  private checkedGamme = [];
  /************ Advanced filter attributes ****/
  public predicateAdvancedSearch: PredicateFormat;
  public filterFieldsColumns = [];
  public filterFieldsInputs = [];
  public searchType = NumberConstant.ONE;

  public filters = new Array<Filter>();
  public predicateTiers: PredicateFormat[] = [];
  public predicateIdTypeTiers: PredicateFormat;
  /************End Advanced filter attributes ****/

  public montantTotal = 0;
  public totalMaterialsCost = 0;
  public hasCostPrice = false;
  
  public formatNumberOptions: NumberFormatOptions;
  private currency: Currency;
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
        field: 'id',
        dir: 'desc'
      }
    ],
    group: []
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: CalculateCostPriceConstant.ARTICLES_FIELD,
      title: CalculateCostPriceConstant.ARTICLES_TITLE,
      filterable: true,
    },
    {
      field: CalculateCostPriceConstant.RANGE_FIELD,
      title: CalculateCostPriceConstant.RANGE_TITLE,
      filterable: true
    },
    {
      field: CalculateCostPriceConstant.UM_FIELD,
      title: CalculateCostPriceConstant.UM_TITLE,
      filterable: true
    },
    {
      field: CalculateCostPriceConstant.TAUX_DE_CHARGE_FIELD,
      title: CalculateCostPriceConstant.TAUX_CHARGE_TITLE,
      filterable: true
    },
    {
      field: CalculateCostPriceConstant.COUT_REVIENT_FIELD,
      title: CalculateCostPriceConstant.COUT_REVIENT_TITLE,
      filterable: true
    }
    ,
    {
      field: CalculateCostPriceConstant.DATE_FIELD,
      title: CalculateCostPriceConstant.DATE_TITLE,
      filterable: true
    },
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  private checkedGammes = false;

  constructor(
    private router: Router,
    private advancedSearchProduction: AdvancedSearchProductionService,
    private gammeService: GammeService,
    private itemService: ItemService,
    private datePipe: DatePipe,
    private swalWarrings: SwalWarring,
    private translate: TranslateService,
    private companyService: CompanyService) {
  }

  ngOnInit(): void {
    this.initPredicateAdvancedSearch();
    this.initFilterFiledConfig();
    this.getCompanyCurrency();
    this.initGridDataSource();
  }
  getCompanyCurrency() {
    this.companyService.getDefaultCurrencyDetails().subscribe((currency: Currency) => {
      this.currency= currency;
      this.formatNumberOptions = {
        style: 'decimal',
        maximumFractionDigits: this.currency.Precision,
        minimumFractionDigits: this.currency.Precision
      };
    });
  }

  /**
   * when the page change , the active page change
   * @param state
   */
  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.gridSettings.state = state;

    this.currentPage = (state.skip) / this.size;

    this.size = state.take;
    this.sortParams = this.advancedSearchProduction.getSortParams(state.sort);
  }

  /**
   * load data when the page change with pagination
   * @param event
   */
  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / event.take;
    this.size = event.take;
    this.initGridDataSource();
  }

  public filterChange() {
    this.initGridDataSource();
  }

  public resetToFirstPage() {
    this.currentPage = NumberConstant.ZERO;
    this.gridSettings.state.skip = this.currentPage;
  }

  public sortChange() {
    this.resetToFirstPage();
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.subscription$ = this.gammeService
      .getAllGammeForCostPriceListPageable(this.currentPage, this.size, this.sortParams, this.filters)
      .subscribe((gammes) => {
        if (gammes.content.length === NumberConstant.ZERO) {
          this.spinner = false;
          this.gridSettings.gridData = {data: gammes.content, total: gammes.totalElements};
        }
        let lastElementInGammes = 0;
        gammes.content.map(gamme => {
          this.itemService.getById(gamme.articleId).subscribe(article => {
            gamme.article = article.Description;
            article.IdUnitStockNavigation === null ? gamme.unitOfMeasure = '' :
              gamme.unitOfMeasure = article.IdUnitStockNavigation.Label;
            gamme.chargeRate = NumberConstant.ZERO;
            if (gamme.costPriceCalculatedDate !== null) {
              gamme.costPriceCalculatedDate = gamme.costPriceCalculatedDate.split('T')[0];
            }
            gamme.costPrice !== null ? this.hasCostPrice = true : this.hasCostPrice = false;
          }, err => {
            this.spinner = false;
          }, () => {
            lastElementInGammes++;
            if (gammes.content.length === lastElementInGammes) {
              this.gridSettings.gridData = {data: gammes.content, total: gammes.totalElements};
            }
          });
        });
      }, () => {
        this.spinner = false;
      }, () => this.spinner = false);
  }

  async calculateCostPrice(gamme: Gamme): Promise<number> {
    return await this.calculateMaterialCost(gamme.gammeOperations)
      + this.calculateEquipmentCost(gamme.gammeOperations)
      + this.calculatePersonnelCost(gamme.gammeOperations);
  }

  async calculateMaterialCost(gammeOperations): Promise<number> {
    let montantTotal = 0;
    for (const gammeOperation of gammeOperations) {
      let materialCostPrice = 0;
      if (gammeOperation.productNomenclatures.length !== NumberConstant.ZERO) {
        for (const material of gammeOperation.productNomenclatures) {
          await this.itemService.getModelByCondition(preparePredicateFilterToGetCostPrice(material.productId))
            .toPromise().then(result => {
              materialCostPrice = result.CostPrice == null ?
                NumberConstant.ZERO : result.CostPrice;
              montantTotal += materialCostPrice * material.quantity;
            });
        }
      }
    }
    return montantTotal;
  }

  calculateEquipmentCost(gammeOperations): number {
    let TotalEquipmentCost = 0;
    gammeOperations.forEach(equip => {
      TotalEquipmentCost += (equip.costMachines / NumberConstant.ONE_HOUR_SECONDS) * equip.machineTimeNet;
    });
    return TotalEquipmentCost;
  }

  calculatePersonnelCost(gammeOperations): number {
    let TotalPersonCost = 0;
    gammeOperations.forEach(person => {
      // cost person will be change by RH call
      TotalPersonCost += Number(person.costPersons / NumberConstant.ONE_HOUR_SECONDS) * person.personTimeNet;
    });
    return TotalPersonCost;
  }

  addOrRemoveSelectedGammeForCalculateCostPrice(options, gamme) {
    if (options.target.checked === true) {
      this.checkedGamme.push(gamme);
    } else {
      this.checkedGamme.splice(
        this.findGammeInCheckedList(gamme), 1
      );
    }
  }

  findGammeInCheckedList(gamme) {
    return this.checkedGamme.findIndex(g => g.id === gamme.id);
  }

  goToNeedsPerOperation(dataItem) {
    this.router.navigateByUrl(OPERATION_PER_NEED_URL.concat(dataItem.id));
  }

  calculateAllSelectedCostPrice() {
    this.checkedGamme.forEach(gamme => {
      this.calculateCostPrice(gamme).then(data => {
        this.gridSettings.gridData.data.map(findedGamme => {
          if (findedGamme.id === gamme.id) {
            findedGamme.costPrice = data.toFixed(NumberConstant.THREE);
            findedGamme.costPriceCalculatedDate = this.datePipe
              .transform(new Date(), CalculateCostPriceConstant.PIPE_FORMAT_DATE_DD_MM_YYYY);
            this.updateGammeCostPriceAndCostPriceCalculatedDate(findedGamme);
          }
        });
      });
    });
  }

  onBtnCalculateClick() {
    this.swalWarrings.CreateSwal(this.translate.instant(CalculateCostPriceConstant.DO_YOU_WANT_TO_CALCULATE),
      `${this.translate.instant(FabricationArrangementConstant.ARE_YOU_SURE)}`,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.calculateAllSelectedCostPrice();
      }
    });
  }

  updateGammeCostPriceAndCostPriceCalculatedDate(gammeToBeUpdated) {
    this.gammeService.getJavaGenericService()
      .callService(Operation.POST, 'update-gamme', gammeToBeUpdated).subscribe();
  }

  selectAllGammes(options) {
    if (options.target.checked === true) {
      this.checkedGammes = true;
      this.checkedGamme = this.gridSettings.gridData.data;
    } else {
      this.checkedGammes = false;
      this.checkedGamme = [];
    }
  }

  /********** Advanced filter begin methods *****/

  initPredicateAdvancedSearch() {
    this.filters = [];
    this.predicateAdvancedSearch = new PredicateFormat();
    this.predicateAdvancedSearch.Filter = new Array<predicate>();
  }

  /**
   * load advancedSearch parameters config
   * @private
   */


  private initFilterFiledConfig() {
    this.filterFieldsColumns.push(new FiltrePredicateModel(CalculateCostPriceConstant.DATE_TITLE,
        CalculateCostPriceConstant.DATE_TYPE, CalculateCostPriceConstant.DATE_FIELD),
      new FiltrePredicateModel(CalculateCostPriceConstant.RANGE_TITLE,
        CalculateCostPriceConstant.STRING_TYPE, CalculateCostPriceConstant.RANGE_FIELD),
      new FiltrePredicateModel(CalculateCostPriceConstant.ARTICLES_TITLE,
        CalculateCostPriceConstant.STRING_ARTICLE_TYPE, CalculateCostPriceConstant.ARTICLES_FIELD));
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

  /**
   * identify the predicate operator AND|OR
   * @param operator
   */
  getOperatorPredicate(operator: Operator) {
    this.predicateAdvancedSearch.Operator = operator;
  }

  async searchClick() {
    this.filters = this.prepareFilter();
    for (const filter of this.filters) {
      if (filter.type === 'date' && !filter.operator) {
        filter.operator = 'eq';
      }
      if (filter.field === 'article') {
        let listArticlesId = '';
        await this.itemService.getByCodeAndDesignation(filter.value).toPromise().then(async listIds => {
          if (listIds) {
            await new Promise(resolve => resolve(
              listIds.map(articleId => {
                listArticlesId += articleId + ',';
              })
            ));
            filter.value = listArticlesId;
          }
        });
      }
    }
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }

  resetClickEvent() {
    this.initPredicateAdvancedSearch();
    this.initGridDataSource();
  }

  prepareFilter() {
    const filters = new Array<Filter>();
    this.predicateAdvancedSearch.Filter.forEach(filter => {
      filters.push(new Filter(this.getFieldType(filter), this.getOperation(filter), filter.prop, filter.value));
    });
    return filters;
  }

  private prepareDatesFiltres(filtreFromAdvSearch) {
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ZERO].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ZERO]);
    }
    if (isNotNullOrUndefinedAndNotEmptyValue(filtreFromAdvSearch.filtres[NumberConstant.ONE].value)) {
      this.predicateAdvancedSearch.Filter.push(filtreFromAdvSearch.filtres[NumberConstant.ONE]);
    }
  }

  getFieldType(filter: predicate): string {
    const type = this.advancedSearchProduction.getType(filter, this.filterFieldsColumns, this.filterFieldsInputs);
    return this.advancedSearchProduction.getFilterType(type);
  }

  getOperation(filter: predicate): string {
    return this.advancedSearchProduction.getOperation(filter, this.filterFieldsColumns, this.filterFieldsInputs);
  }
}
