import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {PagerSettings, DataStateChangeEvent, PageChangeEvent} from '@progress/kendo-angular-grid';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {Router} from '@angular/router';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {filter} from 'rxjs/operator/filter';
import {GammeConstant} from '../../../constant/manufuctoring/gamme.constant';
import {GammeService} from '../../service/gamme.service';
import {ItemService} from '../../../inventory/services/item/item.service';
import {FiltersItemDropdown} from '../../../models/shared/filters-item-dropdown.model';
import {forEach} from 'lodash';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NomenclaturesConstant} from '../../../constant/manufuctoring/nomenclature.constant';
import {PermissionConstant} from '../../../Structure/permission-constant';
import {AuthService} from '../../../login/Authentification/services/auth.service';


@Component({
  selector: 'app-gamme-list',
  templateUrl: './gamme-list.component.html',
  styleUrls: ['./gamme-list.component.scss']
})
export class GammeListComponent implements OnInit, OnDestroy {

  private subscription$: Subscription;

  /**
   * button Advanced Edit visibility
   */
  public btnEditVisible: boolean;
  /**
   * size of pagination => 10 items per page
   */
  private size = NumberConstant.TEN;
  /**
   * default value of filter is empty ''
   */
  public value = '';
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  /**
   * Grid state
   */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.size,
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
      field: GammeConstant.REFERENCE_FIELD,
      title: GammeConstant.REFERENCE_TITLE,
      filterable: true,
    },
    {
      field: GammeConstant.DESIGNATION_FIELD,
      title: GammeConstant.DESIGNATION_TITLE,
      filterable: true
    }
  ];
  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  private currentPage = NumberConstant.ZERO;
  public filtersItemDropdown = new FiltersItemDropdown();

  public MANUFACTURINGPermissions = PermissionConstant.MANUFATORINGPermissions;

  constructor(public authService: AuthService,
              public gammeService: GammeService,
              private router: Router,
              private swalWarrings: SwalWarring,
              private growlService: GrowlService,
              private translate: TranslateService,
              private itemService: ItemService) {
    this.btnEditVisible = true;
  }

  /**
   * Using generic service from GenericManufacturingService to get list of gammes
   *
   */
  initGridDataSource() {
    this.subscription$ = this.gammeService.getJavaGenericService()
      .getEntityList(GammeConstant.GET_GAMME_LIST_PAGEABLE +
        `?reference=${this.value}&page=${this.currentPage}&size=${this.size}`)
      .subscribe((gammes) => {
        let idsItems = [];
        gammes.content.forEach(gamme => {
          idsItems.push(gamme.articleId);
        });
        this.itemService.getItemDetails(idsItems).subscribe(items => {
          items.forEach(item => {
            gammes.content.find(gamme => gamme.articleId === item.Id).article = item.Description;
          });
          this.gridSettings.gridData = {data: gammes.content, total: gammes.totalElements};
        });
        if (gammes.content.length === NumberConstant.ZERO) {
          this.loadAndSearchByArticle();
        }
      });
  }

  loadAndSearchByArticle() {
    this.itemService.getByCodeAndDesignation(this.value).flatMap((items) => {
      return this.gammeService.checkProductsExistInGamme(items, this.currentPage, this.size);
    }).subscribe(gammes => {
      const idsItems = [];
      let lastElementInGammes = NumberConstant.ZERO;
      gammes.content.forEach(gamme => {
        idsItems.push(gamme.articleId);
      });
      this.itemService.getItemDetails(idsItems).subscribe(items => {
        items.forEach(item => {
          gammes.content.find(gamme => gamme.articleId === item.Id).article = item.Description;
        });
        this.gridSettings.gridData = {data: gammes.content, total: gammes.totalElements};
      });
    });
  }

  /*
   * Remove handler
   * @param event
   */
  public removeHandler(event) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.deleteGamme(event.id);
      }
    });
  }

  public deleteGamme(id: number){
    this.subscription$ = this.gammeService.getJavaGenericService()
    .deleteEntity(id)
    .subscribe(() => {
      if (this.gridSettings.gridData.data.length === NumberConstant.ONE && this.currentPage !== NumberConstant.ZERO) {
        this.gridSettings.state.skip -= NumberConstant.ONE;
        this.currentPage -= NumberConstant.ONE;
      }
      this.initGridDataSource();
      this.growlService.successNotification(this.translate.instant(GammeConstant.SUCCESS_OPERATION));
    }, () => {
      this.growlService.ErrorNotification(this.translate.instant(GammeConstant.FAILURE_OPERATION));
    });
  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigate([GammeConstant.URL_EDIT_GAMME.concat(dataItem.id)], {queryParams: filter, skipLocationChange: true});
  }


  /**
   * when the page change , the active page change
   * @param state
   */
  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  /**
   * load data when the page change with pagination
   * @param event
   */
  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip) / event.take;
    this.size = event.take;
    this.goPage();
    this.initGridDataSource();
  }

  /**
   * load data into active page
   */
  goPage() {
    this.gammeService.getJavaGenericService()
      .getEntityList(GammeConstant.GET_GAMME_LIST_PAGEABLE + `?page=${this.currentPage}&size=${this.size}`)
      .subscribe(data => {
        this.gridSettings.gridData.data = data.content;
      });
  }

  /**
   *filter on list gammes page by reference
   */
  onSearch() {
    this.gridSettings.state.skip = NumberConstant.ZERO;
    this.currentPage = NumberConstant.ZERO;
    this.initGridDataSource();
  }


  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  /**
   * ng init
   */
  ngOnInit() {
    this.initGridDataSource();
  }


}
