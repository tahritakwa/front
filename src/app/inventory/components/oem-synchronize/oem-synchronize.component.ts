import { Component, OnInit } from '@angular/core';
import { TeckDockWithWarehouseFilter } from '../../../models/inventory/teckDock-with-warehouse-filter';
import { TecdocService } from '../../services/tecdoc/tecdoc.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { PagerSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { OemService } from '../../services/oem/oem.service';
import { Oem } from '../../../models/inventory/oem.model';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { UserCurrentInformationsService } from '../../../shared/services/utility/user-current-informations.service';
import { OemItemService } from '../../services/oem-item/oem-item.service';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { OemItem } from '../../../models/inventory/oem-item.model';
import {ItemService} from '../../services/item/item.service';

@Component({
  selector: 'app-oem-synchronize',
  templateUrl: './oem-synchronize.component.html',
  styleUrls: ['./oem-synchronize.component.scss']
})
export class OemSynchronizeComponent implements OnInit {
  selectedItem: OemItem;
  public isTecdocFiltered = true;
  selectedSupplier = '';


  public selectableSettings = {
    checkboxOnly: false,
    mode: 'multiple'
  };
  OemNumber: string;
  TecDocArticles: any;
  TecDocArticlesfiltered: any;
  listSupplier = [];
  private predicate: PredicateFormat;
  /**
* Grid state
*/
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 1000,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: ItemConstant.BRAND_COLUMN,
      title: ItemConstant.OEM,
      filterable: true,
    }];
  OemField: any;

  // Grid settings
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public pagerSettings: PagerSettings = {
    buttonCount: 2, info: false,
  };
  showBlocked = false;


  constructor(public oemItemService: OemItemService, public tecdocService: TecdocService, public oemService: OemService,
              public localStorageService : LocalStorageService) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  selectRow(event) {
    event.selectedRows[0].dataItem.isViewed = true;
    this.selectedItem = event.selectedRows[0].dataItem;
    this.OemNumber = this.selectedItem.OemNumber;
    this.getItemsByOEM();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.getItemsWithPredicate();
  }


  changeFilter() {
    this.isTecdocFiltered = !this.isTecdocFiltered;
    this.getItemsByOEM();
  }
  changeBlocked() {
    this.showBlocked = !this.showBlocked;
    this.getItemsByOEM();
  }



  selectsupplier(event) {
    this.selectedSupplier = event;
    if (this.selectedSupplier) {
      this.TecDocArticlesfiltered = this.TecDocArticles.filter(x => x.Supplier === this.selectedSupplier);
    } else {
      this.TecDocArticlesfiltered = this.TecDocArticles.slice(0);
    }
    if (this.isTecdocFiltered) {
      this.TecDocArticlesfiltered = this.TecDocArticlesfiltered.filter(x => x.IsInDb === false);
    }
    this.tecdocService.setarticles(this.TecDocArticlesfiltered);

  }

  public getItemsByOEM() {
    this.listSupplier = [];
    this.selectedSupplier = undefined;
    if (this.OemNumber && this.OemNumber !== '') {
      let teckDockWithWarehouseFilter = new TeckDockWithWarehouseFilter(0, 0, this.localStorageService, null, false, 0, '', false, this.OemNumber);
      this.oemService.getOemlistWithSubbs(teckDockWithWarehouseFilter).subscribe(data => {
        this.TecDocArticles = data.slice(0);

        if (this.isTecdocFiltered) {
          this.TecDocArticlesfiltered = this.TecDocArticles.filter(x => x.IsInDb === false);
        } else {
          this.TecDocArticlesfiltered = data.slice(0);
        }

        if (!this.showBlocked) {
          this.TecDocArticlesfiltered = this.TecDocArticlesfiltered.filter(x => x.IsUnsubbed === false);
        }

        let SetSupplier = new Set(this.TecDocArticlesfiltered.map(x => x.Supplier));
        SetSupplier.forEach(v => this.listSupplier.push(v));
        this.tecdocService.setarticles(this.TecDocArticlesfiltered);
      });
    }
  }
  getItemsWithPredicate() {
    if (!this.predicate) {
      this.predicate = new PredicateFormat();
    }
    this.predicate.page = (this.gridSettings.state.skip / this.gridSettings.state.take);
    this.predicate.pageSize = this.gridSettings.state.take;
    this.oemItemService.reloadServerSideDataWithListPredicate(this.gridSettings.state, [this.predicate],
      SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => {
      this.gridSettings.gridData = data;
      this.gridSettings.gridData.total = data.total;
      this.predicate = new PredicateFormat();
      this.gridSettings.gridData.data.forEach(x => {
        x.isViewed = false;
        x.isNotifOn = true;
      });
    });
  }

  changeNotif(dataItem) {
    dataItem.isNotifOn = !dataItem.isNotifOn;
  }
}
