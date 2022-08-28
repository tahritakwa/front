import { Component, OnInit } from "@angular/core";
import { PredicateFormat, Relation, OrderBy, OrderByDirection, Filter, Operation } from "../../shared/utils/predicate";
import { SharedConstant } from "../../constant/shared/shared.constant";
import { PagerSettings, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { GridSettings } from "../../shared/utils/grid-settings.interface";
import { ItemService } from "../../inventory/services/item/item.service";
import { ItemConstant } from "../../constant/inventory/item.constant";
import { Item } from '../../models/inventory/item.model';
import { ColumnSettings } from "../../shared/utils/column-settings.interface";
import { ItemSynchronizationWithEcommerceStatusEnumerator } from "../../models/enumerators/item-synchronization-with-e-commerce-status.enum";
import { JobTableService } from "../services/job-table/job-table.service";
import { NumberConstant } from "../../constant/utility/number.constant";
import { EcommerceConstant } from "../../constant/ecommerce/ecommerce.constant";
import { EcommerceProductService } from "../services/ecommerce-product/ecommerce-product.service";
import { SwalWarring } from "../../shared/components/swal/swal-popup";
import { GrowlService } from "../../../COM/Growl/growl.service";
import { TranslateService } from '@ngx-translate/core';
import { CompanyService } from "../../administration/services/company/company.service";
import { ActivityAreaEnumerator } from "../../models/enumerators/activity-area.enum";
import {LocalStorageService} from '../../login/Authentification/services/local-storage-service';


@Component({
  selector: 'app-send-product-ecommerce',
  templateUrl: './send-product-ecommerce.component.html',
  styleUrls: ['./send-product-ecommerce.component.scss']
})
export class SendProductEcommerceComponent implements OnInit {
  public columnsConfig: ColumnSettings[] = [
    {
      field: EcommerceConstant.CODE,
      title: EcommerceConstant.REFERENCE_UPPER,
      filterable: true
    },
    {
      field: EcommerceConstant.DESCRIPTION,
      title: EcommerceConstant.DESIGNATION_UPPER,
      filterable: true
    },
    {
      field: EcommerceConstant.IS_ECOMMERCE,
      title: EcommerceConstant.ONLINE_UPPER,
      filterable: true
    },
    {
      field: EcommerceConstant.LAST_UPDATE_ECOMMERCE,
      title: EcommerceConstant.DATE_UPPER,
      filterable: true
    }

  ];
  dataImported: boolean;
  importData: Array<Item>;
  public isEsnVersion: boolean;
  public lastExecutionDate: Date;
  public nextExecutionDate: Date;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public synchronizationWithEcommerceStatus = ItemSynchronizationWithEcommerceStatusEnumerator;
  public Listproducts: number;
  public InProgres: boolean;

  public gridSettings: GridSettings = {
    state: this.itemService.gridState,
    columnsConfig: this.columnsConfig
  };
  lastExecutionDateUTC: Date;

  constructor(public itemService: ItemService, private jobTableService: JobTableService
    , private ecommerceProductService: EcommerceProductService, private growlService: GrowlService, private swalWarrings: SwalWarring,
    private translate: TranslateService,
    private localStorageService : LocalStorageService) {
    this.isEsnVersion = this.localStorageService.getActivityArea() === ActivityAreaEnumerator.Esn;

  }

  public ngOnInit(): void {
    this.initGridDataSource();
  }


  initGridDataSource() {

    this.jobTableService.list().subscribe(lastExecutionDate => {

      if (lastExecutionDate && lastExecutionDate[NumberConstant.ZERO] &&
        lastExecutionDate[NumberConstant.ZERO].LastExecuteDate && lastExecutionDate[NumberConstant.ZERO].NextExecuteDate) {
        this.lastExecutionDateUTC = lastExecutionDate[0].LastExecuteDate;
        this.lastExecutionDate = new Date(lastExecutionDate[0].LastExecuteDate);
        this.nextExecutionDate = new Date(lastExecutionDate[0].NextExecuteDate);
      }

      this.itemService.reloadServerSideData(this.gridSettings.state, this.preparePrediacte(),
        SharedConstant.GET_DATA_SOURCE_PREDICATE).subscribe(result => {
          this.Listproducts = result.data.length;
          result.data.forEach((myObject, index) => {
            myObject.LastUpdateEcommerce = new Date(myObject.LastUpdateEcommerce);
          });
          this.gridSettings.gridData = result;
        });

    });

  }


  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();

  }

  private preparePrediacte(): PredicateFormat {
    let myPredicate = new PredicateFormat();
    myPredicate.Relation = new Array<Relation>();
    /* myPredicate.Relation.push.apply(myPredicate.Relation, [
      new Relation(ItemConstant.ID_TIERS_NAVIGATION)
    ]); */

    myPredicate.Filter = new Array<Filter>();
    // myPredicate.Filter.push(new Filter(EcommerceConstant.EXIST_IN_ECOMMERCE, Operation.eq, true));
    if (this.lastExecutionDate) {
      myPredicate.Filter.push(new Filter(EcommerceConstant.ONLINE_SYNCHONIZATION_STATUS, Operation.isnotnull, null));
    }
    myPredicate.OrderBy = [];
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(EcommerceConstant.LAST_UPDATE_ECOMMERCE, OrderByDirection.desc)]);

    return myPredicate;
  }


  public formatDate(): string {
    return this.translate.instant(SharedConstant.DATE_FORMAT) + ' à HH:mm';
  }

  public synchronizeProductNow() {


    this.swalWarrings.CreateSwal(EcommerceConstant.TEXT_SWAL_WARRING_SYNC_NOW,
      EcommerceConstant.TITLE_SWAL_WARRING_SYNC_NOW,
      EcommerceConstant.TEXT_BUTTON_SWAL_WARRING_SYNC_NOW).then((result) => {
        if (result.value) {
          this.InProgres = true;
          this.growlService.InfoNotification(this.translate.instant(EcommerceConstant.SYNCHRONIZATION_IN_PROGRESS));
          this.ecommerceProductService.synchronizeAllProductsDetailsNow().subscribe(() => {
            this.InProgres = false;
            this.initGridDataSource();
          });
          this.InProgres = false;
        }
      });


  }
  public jobSynchronize() {
    this.ecommerceProductService.ecommerceGetDeliveryForms().subscribe(() => {
    });
  }


}

