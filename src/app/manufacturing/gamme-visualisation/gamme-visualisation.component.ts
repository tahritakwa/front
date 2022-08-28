import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DataStateChangeEvent, GridComponent, PageChangeEvent, PagerSettings, RowClassArgs} from '@progress/kendo-angular-grid';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {Subscription} from 'rxjs';
import {GrowlService} from '../../../COM/Growl/growl.service';
import {GammeConstant} from '../../constant/manufuctoring/gamme.constant';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {NumberConstant} from '../../constant/utility/number.constant';
import {ItemService} from '../../inventory/services/item/item.service';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {GammeService} from '../service/gamme.service';


@Component({
  selector: 'app-gamme-visualisation',
  templateUrl: './gamme-visualisation.component.html',
  styleUrls: ['./gamme-visualisation.component.css']
})
export class GammeVisualisationComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;
  private subscription$: Subscription;
  public displayGraph = false;
  sendGamme: any;
  /**
   * button Advanced Edit visibility
   */

  public btnEditVisible: boolean;
  /**
   * default value of filter is empty ''
   */
  public value = '';
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  radioSelected: any;
  enum_product = [
    {name: 'PF'},
    {name: 'PSF'},
    {name: 'Tous'},
  ];
  public currentStatus = 'confirmed';
  private currentPage = NumberConstant.ZERO;
  private size = NumberConstant.TEN;
  public formGroup: FormGroup;

  listProductsToBeAdded: any[] = [];
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
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  ngOnInit(): void {
    this.initGridDataSource();
  }

  constructor(
    private gammeService: GammeService,
    private itemService: ItemService) {
  }

  public rowCallback(context: RowClassArgs) {
    return {
      dragging: context.dataItem.dragging
    };
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


  initGridDataSource() {
    if (parseInt(this.value, 10) || this.value === '') {
      this.subscription$ = this.gammeService.getJavaGenericService()
        .getEntityList(GammeConstant.GET_GAMME_LIST_PAGEABLE +
          `?reference=${this.value}&page=${this.currentPage}&size=${this.size}`)
        .subscribe((gammes) => {
          let lastElementInGammes = 0;
          gammes.content.map(gamme => {
            gamme.showGammeInGraph = false ;
            gamme.gammeOperations.forEach(gammeOp => {
              gammeOp.productNomenclatures.map(nomenclature => {
                this.itemService.getById(nomenclature.productId).subscribe(article => {
                  nomenclature.articleName = article.Description;
                });
              });
            });
            this.itemService.getById(gamme.articleId).subscribe(article => {
              gamme.article = article.Description;
            }, err => {
            }, () => {
              lastElementInGammes++;
              if (gammes.content.length === lastElementInGammes) {
                this.gridSettings.gridData = {data: gammes.content, total: gammes.totalElements};
              }
            });
          });
        });
    }
  }

  mapArticleNameInProductNomenclature(productNomenclatures) {

  }

  displayGammeInGraphe(event) {
    event.showGammeInGraph = !event.showGammeInGraph;
    this.sendGamme = event;
    this.displayGraph = !this.displayGraph;
  }


}
