import { Component, Input, OnChanges, ViewChild, OnInit } from '@angular/core';
import { State, process } from '@progress/kendo-data-query';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ItemService } from '../../services/item/item.service';
import { Item } from '../../../models/inventory/item.model';
import { GridComponent, GridDataResult, RowClassArgs } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs/Observable';
import { TecDocArticleModel } from '../../../models/inventory/tec-doc-article.model';
import { TeckDockWithWarehouseFilter } from '../../../models/inventory/teckDock-with-warehouse-filter';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { TecdocService } from '../../services/tecdoc/tecdoc.service';
import { Router } from '@angular/router';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { isNullOrUndefined } from 'util';
import { notEmptyValue } from '../../../stark-permissions/utils/utils';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ActivityAreaEnumerator } from '../../../models/enumerators/activity-area.enum';
import { CompanyService } from '../../../administration/services/company/company.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';


@Component({
  selector: 'app-tec-doc-advanced-list-product',
  templateUrl: './tec-doc-advanced-list-product.component.html',
  styleUrls: ['./tec-doc-advanced-list-product.component.scss']
})
export class TecDocAdvancedListProductComponent implements OnChanges, OnInit {

  public FormatNumber = SharedConstant.NUMBER_FORMAT;
  public RoleConfigConstant = RoleConfigConstant;
  @ViewChild(GridComponent) private grid: GridComponent;
  @Input() isCollapsed: boolean;
  @Input() tecdocItem: Item;
  @Input() isEquivalenceGroupInterface = false;
  @Input() sendToDocument: boolean;
  @Input() isModal: boolean;
  public view: Observable<GridDataResult>;
  public equivalenceGrpList: Array<any>;
  public isInSalesRole = false;
  public FromApi: any;
  SelectedForDetails: any;
  opentecdocdetails: boolean;

  isAutoVersion: boolean;
  constructor(public tecdocService: TecdocService, public itemService: ItemService, private router: Router,
    private rolesService: StarkRolesService, private localStorageService : LocalStorageService) {
        this.isAutoVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Auto;

  }

  public gridEquivalenceSettings: GridSettings = {
    state: this.itemService.gridState,
    columnsConfig: this.itemService.TecDoccolumnsConfig
  };

  ngOnInit(): void {
    this.itemService.getJson('environments/TecDocConf.json').subscribe(data => {
      this.FromApi = data.IsUseTecDocApi;
    });
    this.equivalenceGrpList = new Array();
    this.rolesService.ListRoleConfigsAsObservable().subscribe((roledata: Array<any>) => {
      if (!isNullOrUndefined(roledata) && notEmptyValue(roledata)) {
        this.rolesService.hasOnlyRoles([RoleConfigConstant.SalesConfig])
          .then(x => {
            this.isInSalesRole = x === true ? true : false;
            this.rolesService.hasOnlyRoles([RoleConfigConstant.SuperAdminConfig,
            RoleConfigConstant.AdminConfig, RoleConfigConstant.PurchaseConfig])
              .then(x => { this.isInSalesRole = x === true ? false : true; });
          });
      }
    });

  }

  public ngOnChanges() {
    //if (!this.searchItemService.isFromSearchItem_supplierInetrface) {
      if (this.itemService.TecDoc && this.tecdocItem) {
        const selectedTecDocItem = new TeckDockWithWarehouseFilter(null, null, this.localStorageService, 0, false,
          this.itemService.TecDocIdSupplier, this.itemService.TecDocReference, false, null);
        this.itemService.GetEquivalentTecDoc(selectedTecDocItem)
          .subscribe(data => {
            //if (data && data.length > 0) {
              this.gridEquivalenceSettings.state.skip = 0;
              this.equivalenceGrpList = data as Array<TecDocArticleModel>;
              this.gridEquivalenceSettings.gridData = {
                data: data.slice(this.gridEquivalenceSettings.state.skip,
                  this.gridEquivalenceSettings.state.take),
                total: this.equivalenceGrpList.length
              };
              this.gridEquivalenceSettings.columnsConfig = this.itemService.TecDoccolumnsConfig;
           // }
          });
      } else {
        this.gridEquivalenceSettings.gridData = {
          data: [],
          total: 0
        };
      }
   // }
  }
  public onStateChange(state: State) {
    this.gridEquivalenceSettings.gridData.data = [];
    this.gridEquivalenceSettings.state = state;
    const listEquivalence = Object.assign([], this.equivalenceGrpList);
    this.gridEquivalenceSettings.gridData = process(listEquivalence, state);
  }

  /**
  * load item wrhouse related to the item
  * @param event
  */
  public loadWarehousDetails(event: any) {
    this.itemService.loadWarhouseDetails(event, true);
  }

  public rowCallback(context: RowClassArgs) {
    const isEven = context.index % 2 === 0;
    return {
      notecodd: !isEven && !context.dataItem.IsInDb,
      noteceven: isEven && !context.dataItem.IsInDb
    };
  }

  onClickGoToDetails(id) {
    this.router.navigateByUrl(ItemConstant.DETAILS_URL.concat(id));
  }


  openTecdocModal(dataItem) {
    this.SelectedForDetails = dataItem;
    this.SelectedForDetails.TecDocRef = dataItem.Reference;
    this.SelectedForDetails.TecDocIdSupplier = dataItem.IdSupplier;
    this.opentecdocdetails = true;
  }

  closeTecdocModal() {
    this.opentecdocdetails = false;
  }


}


