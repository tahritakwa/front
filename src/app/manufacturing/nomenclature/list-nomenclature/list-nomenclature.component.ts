import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataStateChangeEvent, GridComponent, PageChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { NomenclaturesConstant } from '../../../constant/manufuctoring/nomenclature.constant';
import { NomenclatureService } from '../../service/nomenclature.service';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { ItemService } from '../../../inventory/services/item/item.service';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductNomenclatureService } from '../../service/product-nomenclature.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { State } from '@progress/kendo-data-query';
import { SharedConstant } from '../../../constant/shared/shared.constant';

import {FiltersItemDropdown} from '../../../models/shared/filters-item-dropdown.model';
import {data} from 'jquery';
import {AuthService} from '../../../login/Authentification/services/auth.service';
import {PermissionConstant} from '../../../Structure/permission-constant';

@Component({
  selector: 'app-list-nomenclature',
  templateUrl: './list-nomenclature.component.html',
  styleUrls: ['./list-nomenclature.component.scss']
})
export class ListNomenclatureComponent implements OnInit, OnDestroy {

  private subscription$: Subscription;
  private canBeDeleted: number;

  /**
   * button Advanced Edit visibility
   */
  public btnEditVisible: boolean;
  /**
   * preducate
   */
  public predicate: PredicateFormat;
  /**
   * size of pagination => 10 items per page
   */
  private size = NumberConstant.TEN;
  /**
   * default value of filter is empty ''
   */
  public value = '';
  // pager settings

  /**
   * Grid state
   */

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
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
      field: NomenclaturesConstant.REFERENCE_FILIED,
      title: NomenclaturesConstant.REFERENCE_TITLE,
      filterable: true,
    },
    {
      field: NomenclaturesConstant.TYPE_NOMENCLATURE_FILIED,
      title: NomenclaturesConstant.TYPE_NOMENCLATURE_TITLE,
      filterable: true
    },
    {
      field: NomenclaturesConstant.PRODUCT_NAME_FILIED,
      title: NomenclaturesConstant.PRODUCT_NAME_TITLE,
      filterable: true
    }
  ];
  // Grid settingso
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  // Grid quick add
  public formGroup: FormGroup;
  @ViewChild(GridComponent) grid: GridComponent;
  private currentPage = NumberConstant.ZERO;

  public MANUFACTURINGPermissions = PermissionConstant.MANUFATORINGPermissions;
  constructor(public authService: AuthService,
              public nomenclatureService: NomenclatureService,
              public tiersService: TiersService,
              public itemService: ItemService,
              public productNomenclatureService: ProductNomenclatureService,
              private router: Router,
              private swalWarrings: SwalWarring,
              private fb: FormBuilder,
              private growlService: GrowlService,
              private translate: TranslateService) {
    this.predicate = PredicateFormat.prepareTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    this.btnEditVisible = true;
  }

  /**
   * Using generic service from GenericManufacturingService to get list of nomenclatures
   *
   */
  initGridDataSource(pageFilter?: number) {
    if (pageFilter != null) {
      this.currentPage = pageFilter;
    }
    this.loadAndSearchByNomenclatureReference();
  }


  loadAndSearchByNomenclatureReference() {
    this.subscription$ = this.nomenclatureService.getJavaGenericService()
      .getEntityList(NomenclaturesConstant.GET_NOMENCLATURES_PAGEABLE +
        `?reference=${this.value}&page=${this.currentPage}&size=${this.size}`)
      .subscribe((nomenclatures) => {
        let lastElementInNomenclatures = 0;
        const nomneclaturesSize = nomenclatures.content.length;
        let idsItems = [];
        nomenclatures.content.forEach(nomenclature => {
          idsItems.push(nomenclature.productId);
        });
        this.itemService.getItemDetails(idsItems).subscribe(items => {
          items.forEach(item => {
            nomenclatures.content.find(nomenclature => nomenclature.productId === item.Id).description = item.Description;
          });
          this.gridSettings.gridData = {data: nomenclatures.content, total: nomenclatures.totalElements};
        });
        if (nomneclaturesSize === NumberConstant.ZERO) {
          this.loadAndSearchByArticle();
        }
      });
  }

  loadAndSearchByArticle() {
    this.itemService.getByCodeAndDesignation(this.value).flatMap((items) => {
      return this.nomenclatureService.checkProductsExistInNomenclature(items, this.currentPage, this.size);
    }).subscribe(nomenclatures => {
      let lastElementInNomenclatures = 0;
      nomenclatures.content.map((nomenclature) => {
        this.itemService.getById(nomenclature.productId).subscribe(res => {
          nomenclature.description = res[NomenclaturesConstant.NOMENCLATURE_DESCRIPTION];
        }, err => {
        }, () => {
          ++lastElementInNomenclatures;
          if (nomenclatures.content.length === lastElementInNomenclatures) {
            this.gridSettings.gridData = {data: nomenclatures.content, total: nomenclatures.totalElements};
          }
        });
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
     this.toDeleteNomenclature(event);
      }
    });
  }

  public toDeleteNomenclature(event){
    this.nomenclatureService.isNomenclatureUsedInGamme(event.id).subscribe((data: any)=>{
      this.canBeDeleted= data;
      if (this.canBeDeleted>0){
        this.growlService.ErrorNotification(this.translate.instant(NomenclaturesConstant.CANNOT_DELETE_NOMENCLATURE));
      }
      else{
        this.deleteNomenclature(event);
      }
    })
  }

  public deleteNomenclature(event){
    this.nomenclatureService.getJavaGenericService()
    .deleteEntity(event.id, NomenclaturesConstant.NOMENCLATURES_URL)
    .subscribe(() => {
      this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));
      this.initGridDataSource();
    }, () => {
      this.growlService.ErrorNotification(this.translate.instant(NomenclaturesConstant.FAILURE_OPERATION));
    });
  }

  /**
   * edit click row event
   * @param dataItem
   */
  public goToAdvancedEdit(dataItem) {
    this.router.navigate([NomenclaturesConstant.URI_ADVANCED_EDIT.concat(dataItem.id)], { queryParams: filter, skipLocationChange: true });
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
    this.nomenclatureService.getJavaGenericService().getEntityList(
      NomenclaturesConstant.GET_NOMENCLATURES_PAGEABLE + `?page=${this.currentPage}&size=${this.size}`).subscribe(data => {
        this.gridSettings.gridData.data = data.content;
      });
  }

  /**
   *filter on list nomenclature page by reference
   */
  onSearch() {
    if (this.value === '' || this.value.length < NumberConstant.THREE) {
      this.value = '';
      this.initGridDataSource();
    } else if (this.value.length >= NumberConstant.THREE) {
      this.initGridDataSource(0);
    }
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
